import {supabase} from '$lib/supabaseClient'
import {fail, json} from '@sveltejs/kit';
import type {  RequestEvent } from '@sveltejs/kit';


export async function PUT({request}: RequestEvent) {
    const formData = await request.formData()
    // const body = await request.json()
    // const title = body.title;
    // const content = body.content;
    // const id = body.id;
        const title = formData.get('title')?.toString();
    const content = formData.get('content')?.toString();
    const id = formData.get('id')?.toString();

   

    

    if(!id) {
        return json( {error: "Title or content not present"}, {status: 400},)
    }

    const {error} = await supabase.from('markdown_blog_table').update({title: title, content: content}).eq('id', Number(id));

    if(error) {
        return json({error: error.message}, {status: 400}, )
    }
    return json({success: true, id: id})
}