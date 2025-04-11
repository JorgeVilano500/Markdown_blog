<script lang="ts">
    import { invalidate } from '$app/navigation';
    import { error } from '@sveltejs/kit';



    import FormComponent from '../components/FormComponent.svelte';
    import FormHistoryComponent from '../components/FormHistoryComponent.svelte'

    type Post = {
            id: String; 
            title: String;
            created_at: String;
            content: String
    }
    export let data: {
        posts: Post[];
    }

    let blogs = data.posts 
    let title = '';
    let content = '';

    async function deletePost(id: string) {
        const formData = new FormData();
        formData.append('id', id)

        const res = await fetch('?/delete', {
            method: 'POST', 
            body: formData
        })

        if(res.ok){
            blogs = blogs.filter(blog => blog.id !== id)
            await invalidate('/');
        } else  {
            console.error('Delete failed')
        }
    }

    async function addPost(title: string, content: string) {
        const formData = new FormData();
        formData.append('title', title)
        formData.append('content', content)

        const res = await fetch('?/addBlog', {
            method: 'POST', 
            body: formData
        })

        if(res.ok){
            const blogResponse = await res.json()
            const parsed = JSON.parse(blogResponse.data)
            
            const id = parsed[4]
            const created_at = parsed[5];
            const content = parsed[6];
            const title = parsed[7];

            const newBlog = {
                id: id, 
                created_at: created_at, 
                content: content, 
                title: title
            }

            blogs.push(newBlog)

            

        //   console.log(JSON.parse(blogResponse.data))
            await invalidate('/');
        } else  {
            console.error('Delete failed')
        }
    }
    
</script>


<section>
    <h1 class="text-center text-3xl font-semibold my-4">Write To Blog</h1>

    <FormComponent title={title} content={content} addPost={addPost} />
 

    <FormHistoryComponent deletePost={deletePost} blogs={blogs} />

</section>

<style>
    @reference "tailwindcss";

:global(html) {
    background-color: theme(--color-gray-100);
  }
</style>
