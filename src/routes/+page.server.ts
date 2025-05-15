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

}



export const load: PageServerLoad = async () => {
    const {data: posts, error} = await supabase.from('markdown_blog_table').select('*').order('created_at', {ascending: false})

    if(error) {
        console.log(`Error fetching posts: ${error.message}`)
        return {posts: []}
    }

    return {posts}

}