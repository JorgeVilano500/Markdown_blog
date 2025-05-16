
<script lang="ts">
    import { marked } from 'marked';
    import IoIosArrowDown from 'svelte-icons/io/IoIosArrowDown.svelte'
    import IoIosArrowUp from 'svelte-icons/io/IoIosArrowUp.svelte'
    import GoX from 'svelte-icons/go/GoX.svelte'
    let showBlogForm = false;
    let title: string;
    let content: string;
    let editIndex:number;

    export let editPost;
    export let blogs;

    export let deletePost;

    let onEdit = false; 

    const handleSubmit = (title: string, content:string, id: string) => {
        console.log(id);
        editPost(title, content, id)
        onEdit = !onEdit;
    }

   
</script>

<section class={`bg-gray-400 mx-4 rounded my-4 p-4 ${showBlogForm ? 'h-[20rem]' : 'h-auto'}  overflow-y-auto`}>
    <button on:click={() => showBlogForm = !showBlogForm} class={`text-2xl font-bold flex flex-row justify-center mx-auto`}>Blog History {#if showBlogForm} <div  class="size-8 self-center" ><IoIosArrowUp/> </div> {:else} <div  class="size-8 self-center" ><IoIosArrowDown/> </div> {/if}</button>

   {#if showBlogForm}

        {#each blogs as blog, i }
        <div class="prose bg-white w-full h-[15rem] p-4 mx-auto my-4 rounded xl overflow-y-auto overflow-x-hidden relative">
            
            {#if onEdit && editIndex === i}
                <button on:click={() => { onEdit = !onEdit;}} class="mx-2 top-2 w-auto p-2 rounded-xl right-26 absolute  bg-gray-400 transition ease-in-out hover:bg-gray-700 hover:text-white hover:cursor-pointer">Cancel</button>
                <button on:click={() => {handleSubmit(title, content, blog.id) }} class="mx-2 top-2 w-auto p-2 rounded-xl right-12 absolute  bg-gray-400 transition ease-in-out hover:bg-gray-700 hover:text-white hover:cursor-pointer">Save</button>
            {:else}
                <button on:click={() => { onEdit = !onEdit; editIndex = i; content = blog?.content; title = blog?.title;}} class="top-2 w-auto p-2 rounded-xl right-12 absolute  bg-gray-400 transition ease-in-out hover:bg-gray-700 hover:text-white hover:cursor-pointer">Edit</button>
            {/if}

                <button on:click={() => deletePost(blog?.id)} class="mx-2 top-2 size-4 right-0 absolute m-4 hover:cursor-pointer"><GoX/></button>

                {
                    #if onEdit && editIndex === i
                }
                <div>
            
                    <div class="mt-4">
                        <label class="text-black text-xl font-semibold" for="title">Title</label>
                        <input required name="title" bind:value={title} placeholder="Enter a title for your blog" class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" type="text">
                    </div>
                    <div class="mt-4">
                        <label class="text-black text-xl font-semibold" for="description">Description</label>
                        <textarea name="content" bind:value={content} rows="3" required placeholder="Describe your blog in detail" class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" id="description"></textarea>
                    </div>
                    {@html marked.parse(blog?.content)}
                </div>
                {:else}
                    {@html marked.parse(blog?.content)}
                {/if}
                
        </div>
        {/each}
  
    {/if}    
</section>