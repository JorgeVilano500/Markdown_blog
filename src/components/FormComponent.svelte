
<script lang="ts">
    import IoIosArrowDown from 'svelte-icons/io/IoIosArrowDown.svelte'
    import IoIosArrowUp from 'svelte-icons/io/IoIosArrowUp.svelte'
    import {marked} from 'marked';
    export let title: string ;
    export let content: string ;
    let showBlogForm = false;

    export let addPost;

    // let {content} = $props();

//     const resetForm = enhance(() => {
//     return {
//       result: (res: ActionResult) => {
//         if (res.type === 'success') {
//           title = '';
//           content = '';
//         }
//       }
//     };
//   });
</script>


<!-- /* From Uiverse.io by themrsami */  -->
<form on:submit={() => addPost(title, content)} class="mx-4 mt-4 flex flex-col bg-gray-400 rounded-lg p-4 shadow-sm">
  <button on:click={() => {showBlogForm = !showBlogForm}} class={`ai-story-maker-dream-form text-black font-bold text-2xl flex flex-row items-center justify-center`}>Blog Markdown Form {#if showBlogForm} <div  class="size-8 self-center" ><IoIosArrowUp/> </div> {:else} <div  class="size-8 self-center" ><IoIosArrowDown/> </div> {/if} </button>

  {#if showBlogForm}
    <div class="mt-4">
        <label class="text-black" for="title">Title</label>
        <input required name="title" bind:value={title} placeholder="Enter a title for your blog" class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" type="text">
    </div>

    <div class="mt-4">
        <label class="text-black" for="description">Description</label>
        <textarea name="content" bind:value={content} rows="3" required placeholder="Describe your blog in detail" class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" id="description"></textarea>
    </div>
    <!-- 
    <div class="mt-4 flex flex-row space-x-2">
        <div class="flex-1">
        <label class="text-black" for="emotions">Emotions</label>
        <input placeholder="What emotions did you feel during your dream?" class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" id="emotions" type="text">
        </div>

        <div class="flex-1">
        <label class="text-black" for="symbols">Symbols</label>
        <input placeholder="Did you see any symbols in your dream?" class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" id="symbols" type="text">
        </div>
    </div>

    <div class="mt-4 flex flex-row space-x-2">
        <div class="flex-1">
        <label class="text-black" for="themes">Themes</label>
        <input placeholder="What themes do you think your dream might be about?" class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" id="themes" type="text">
        </div>
    </div> -->

    <div class="mt-4 flex justify-end">
        <button class="bg-white text-black rounded-md px-4 py-1 hover:bg-gray-200 hover:text-gray-900" id="generate-button" type="submit">Submit</button>
    </div>

    <!-- <div class="mt-4">
        <textarea placeholder="Your AI-generated story will appear here" class="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1 h-48" id="story-output"></textarea>
    </div> -->
    <div class="prose" >
        {@html marked(content)}
    </div>
    {:else}
    <div></div>
  {/if}

</form>
