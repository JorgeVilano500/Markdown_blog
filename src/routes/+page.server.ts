import {supabase} from '$lib/supabaseClient'
import {fail, redirect} from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const actions: Actions = {

    delete: async ({request} : RequestEvent) => {
        const formData = await request.formData();
        const id = formData.get('id')

        if(!id || typeof id !== 'string') {
            return {success: false, error: 'Invalid Id'}
        }

        const {error} = await supabase.from('markdown_blog_table').delete().eq('id', id)

        if(error) {
            return {success: false, error: error.message}
        }

        return {success: true}


    },

    addBlog: async ({request} : RequestEvent) => {
        const formData = await request.formData();
        const title = formData.get('title')?.toString();
        const content = formData.get('content')?.toString();
        const file : File[]   = formData.get('files[]');
        
        let markdownFile : File | null = null;
        let imageFiles : File[] = []
        let text: string;

        if(file) {
            
            for (const f of file) {
                if (f.name.endsWith('.md')) markdownFile = f
                else imageFiles.push(f);
                text = await f.text();

                const matches = [...text.matchAll(/!\[.*?\]\((.*?)\)/g)]
                // ex. ["images/map.png", "photos/pic2.jpg"]
                const referencedPaths = matches.map(m => m[1])

                let updatedMarkdown = text;


                for (const path of referencedPaths) {
                    const filename = path.split("/").pop();
                    const imageFile = imageFiles.find(f => f.name.endsWith(filename!))


                    if(!imageFile) continue;
 
                    const {data, error} = await supabase.storage.from('blog-assets').upload(`posts/${Date.now()}-${imageFile.name}`, imageFile)

                    if(error) {
                        console.log(error);
                        continue;
                    }


                    const publicUrl = supabase.storage.from('blog-assets').getPublicUrl(data.path).data.publicUrl;


                    updatedMarkdown = updatedMarkdown.replace(path, publicUrl)

                }


                formData.append('content', text);
            }


        } else {
            
        }
        

        if (!title || !content) {
            return fail(400, {error: "title and content are required"});
        }

        const {data: blogData, error} = await supabase.from('markdown_blog_table').insert({title, content}).select()

        if (error) {
            console.log(`Supabase insert error ${error}`)
            return fail(500, {error: error.message})
        }

        // throw redirect(303, '/');
        return {success: true, data: blogData}
    },
    editBlog: async ({request}: RequestEvent) => {
        const formData = await request.formData();
        const title = formData.get('title')?.toString()
        const content = formData.get('content')?.toString()
        const id = formData.get('id')?.toString()

        if (!content || !id) {
            return fail(400, {error: 'Missing content, or id'})
        }

        const {data, error} = await supabase.from('markdown_blog_table').update({content: content, title: title}).eq('id', id).select();

        if(error) {
            console.log(`Supabase insert error ${error}`)
            return fail(500, {error: error.message})
        }

        return {success: true, data: data }

    }

}



export const load: PageServerLoad = async () => {
    const {data: posts, error} = await supabase.from('markdown_blog_table').select('*').order('created_at', {ascending: false})

    if(error) {
        console.log(`Error fetching posts: ${error.message}`)
        return {posts: []}
    }

    return {posts}

}