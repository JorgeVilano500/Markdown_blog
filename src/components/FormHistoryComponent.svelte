<script lang="ts">
    import { marked } from '$lib/markdown';

    let showPreview = false;
    let title: string;
    let content: string;
    let editIndex: number;
    let onEdit = false;

    export let editPost;
    export let blogs;
    export let deletePost;

    const handleSubmit = (t: string, c: string, id: string) => {
        editPost(t, c, id)
        onEdit = false;
    }
</script>

{#if blogs.length === 0}
    <div class="flex flex-col items-center justify-center h-64">
        <p class="text-slate-400 text-sm">No posts yet. Create your first post!</p>
    </div>
{:else}
    <div class="space-y-4 max-w-3xl">
        {#each blogs as blog, i}
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">

                <!-- Card header -->
                <div class="px-6 py-4 flex items-start justify-between gap-4">
                    <div class="min-w-0">
                        <h2 class="text-base font-semibold text-slate-800 truncate">{blog.title}</h2>
                        <p class="text-xs text-slate-400 mt-0.5">
                            {new Date(String(blog.created_at)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        {#if onEdit && editIndex === i}
                            <button
                                on:click={() => { onEdit = false; showPreview = false; }}
                                class="text-xs px-3 py-1.5 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                            >Cancel</button>
                            <button
                                on:click={() => handleSubmit(title, content, blog.id)}
                                class="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                            >Save</button>
                        {:else}
                            <button
                                on:click={() => { onEdit = true; editIndex = i; content = blog?.content; title = blog?.title; showPreview = false; }}
                                class="text-xs px-3 py-1.5 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                            >Edit</button>
                        {/if}
                        <button
                            on:click={() => deletePost(blog?.id)}
                            class="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
                            aria-label="Delete post"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Card body -->
                <div class="border-t border-slate-100 px-6 py-4">
                    {#if onEdit && editIndex === i}

                        <!-- Edit/Preview toggle -->
                        <div class="flex gap-1 mb-4 bg-slate-100 p-1 rounded-lg w-fit">
                            <button
                                class={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${!showPreview ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                on:click={() => showPreview = false}
                            >Edit</button>
                            <button
                                class={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${showPreview ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                on:click={() => showPreview = true}
                            >Preview</button>
                        </div>

                        {#if showPreview}
                            <div class="prose prose-sm max-w-none">
                                {@html marked.parse(content)}
                            </div>
                        {:else}
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-xs font-medium text-slate-700 mb-1.5" for="edit-title-{i}">Title</label>
                                    <input
                                        id="edit-title-{i}"
                                        bind:value={title}
                                        class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        type="text"
                                    >
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-slate-700 mb-1.5" for="edit-content-{i}">Content</label>
                                    <textarea
                                        id="edit-content-{i}"
                                        bind:value={content}
                                        rows="10"
                                        class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        {/if}

                    {:else}
                        <!-- Content preview with fade -->
                        <div class="relative">
                            <div class="prose prose-sm max-w-none max-h-36 overflow-hidden text-slate-600">
                                {@html marked.parse(blog?.content)}
                            </div>
                            <div class="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                        </div>
                    {/if}
                </div>

            </div>
        {/each}
    </div>
{/if}
