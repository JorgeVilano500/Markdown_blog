<script lang="ts">
    import { marked } from '$lib/markdown';
    export let title: string;
    export let content: string;
    export let addPost;

    let windowView: 'write' | 'preview' = 'write';
    let files: FileList | undefined;
</script>

<div class="max-w-3xl">

    <!-- Write / Preview tab switcher -->
    <div class="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        <button
            class={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${windowView === 'write' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            on:click={() => windowView = 'write'}
        >Write</button>
        <button
            class={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${windowView === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            on:click={() => windowView = 'preview'}
        >Preview</button>
    </div>

    {#if windowView === 'write'}
        <form on:submit|preventDefault={() => addPost(title, content, files ? [...files] : undefined)} class="space-y-5">

            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="title">Title</label>
                <input
                    required
                    id="title"
                    name="title"
                    bind:value={title}
                    placeholder="Post title"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    type="text"
                >
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="post-content">
                    Content <span class="text-slate-400 font-normal">(Markdown)</span>
                </label>
                <textarea
                    id="post-content"
                    name="content"
                    bind:value={content}
                    rows="16"
                    required
                    placeholder="Write your post in Markdown…"
                    class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 placeholder:text-slate-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                ></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="attachments">
                    Attachments <span class="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                    id="attachments"
                    type="file"
                    multiple
                    bind:files
                    class="block text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                >
            </div>

            <div class="flex justify-end pt-1">
                <button
                    type="submit"
                    class="bg-indigo-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
                >Publish Post</button>
            </div>

        </form>

    {:else}
        {#if content}
            <div class="prose max-w-none bg-white rounded-xl border border-slate-200 p-8">
                {@html marked.parse(content)}
            </div>
        {:else}
            <div class="flex items-center justify-center h-48 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <p class="text-slate-400 text-sm">Nothing to preview yet — write something first.</p>
            </div>
        {/if}
    {/if}

</div>
