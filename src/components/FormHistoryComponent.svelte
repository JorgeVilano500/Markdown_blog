
<script lang="ts">
    import { marked } from 'marked';
    import IoIosArrowDown from 'svelte-icons/io/IoIosArrowDown.svelte'
    import IoIosArrowUp from 'svelte-icons/io/IoIosArrowUp.svelte'
    import GoX from 'svelte-icons/go/GoX.svelte'
    let showBlogForm = false;

    export let blogs;

    export let deletePost;

   
</script>

<section class={`bg-gray-400 mx-4 rounded my-4 p-4 ${showBlogForm ? 'h-[20rem]' : 'h-auto'}  overflow-y-auto`}>
    <button on:click={() => showBlogForm = !showBlogForm} class={`text-2xl font-bold flex flex-row justify-center mx-auto`}>Blog History {#if showBlogForm} <div  class="size-8 self-center" ><IoIosArrowUp/> </div> {:else} <div  class="size-8 self-center" ><IoIosArrowDown/> </div> {/if}</button>

   {#if showBlogForm}

        {#each blogs as blog }
        <div class="prose bg-white w-[50%] h-[15rem] p-4 mx-auto my-4 rounded xl overflow-y-auto overflow-x-hidden relative">
            
                <button on:click={() => {}} class="top-2 w-auto p-2 rounded-xl right-12 absolute  bg-gray-400 transition ease-in-out hover:bg-gray-700 hover:text-white hover:cursor-pointer">Edit</button>
                <button on:click={() => deletePost(blog?.id)} class="top-2 size-4 right-0 absolute m-4 hover:cursor-pointer"><GoX/></button>
                
            {@html marked.parse(blog?.content)}
        </div>
        {/each}
  
    {/if}    
</section>