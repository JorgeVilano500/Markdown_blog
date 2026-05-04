<script lang="ts">
    import { marked } from '$lib/markdown';
    export let title: string;
    export let content: string;
    export let addPost;

    let windowView: 'write' | 'preview' = 'write';
    let files: FileList | undefined;

    let cover_emoji: string   = '';
    let excerpt:     string   = '';
    let tags:        string[] = [];
    let theme:       string   = '';
    let newTag:      string   = '';
    let showSettings          = false;

    const COLOR_PALETTE = [
        { label: 'Indigo',  hex: '#6366f1' },
        { label: 'Violet',  hex: '#8b5cf6' },
        { label: 'Purple',  hex: '#a855f7' },
        { label: 'Pink',    hex: '#ec4899' },
        { label: 'Rose',    hex: '#f43f5e' },
        { label: 'Orange',  hex: '#f97316' },
        { label: 'Amber',   hex: '#f59e0b' },
        { label: 'Lime',    hex: '#84cc16' },
        { label: 'Emerald', hex: '#10b981' },
        { label: 'Teal',    hex: '#14b8a6' },
        { label: 'Sky',     hex: '#0ea5e9' },
        { label: 'Slate',   hex: '#64748b' },
    ];

    const addTag = () => {
        const t = newTag.trim();
        if (t && !tags.includes(t)) tags = [...tags, t];
        newTag = '';
    };

    const removeTag = (idx: number) => {
        tags = tags.filter((_, j) => j !== idx);
    };
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
        <form on:submit|preventDefault={() => addPost(title, content, files ? [...files] : undefined, cover_emoji, excerpt, tags, theme)} class="space-y-5">

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

            <!-- Post Settings accordion -->
            <div class="rounded-lg border border-slate-200 overflow-hidden">
                <button
                    type="button"
                    on:click={() => showSettings = !showSettings}
                    class="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                    <span class="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Post Settings
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {#if showSettings}
                    <div class="px-4 py-4 space-y-4 border-t border-slate-200 bg-white">

                        <!-- Cover Emoji -->
                        <div class="flex items-start gap-4">
                            <div class="w-14 h-14 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-3xl shrink-0 bg-slate-50">
                                {cover_emoji || '✏️'}
                            </div>
                            <div class="flex-1">
                                <label class="block text-xs font-medium text-slate-700 mb-1.5" for="new-emoji">Cover Emoji</label>
                                <input
                                    id="new-emoji"
                                    bind:value={cover_emoji}
                                    placeholder="e.g. 🚀"
                                    maxlength="4"
                                    class="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    type="text"
                                >
                                <p class="text-xs text-slate-400 mt-1">Displayed on the post card</p>
                            </div>
                        </div>

                        <!-- Excerpt -->
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1.5" for="new-excerpt">
                                Excerpt
                                <span class="text-slate-400 font-normal ml-1">— shown in post previews</span>
                            </label>
                            <textarea
                                id="new-excerpt"
                                bind:value={excerpt}
                                rows="3"
                                placeholder="A short summary of this post…"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            ></textarea>
                        </div>

                        <!-- Tags -->
                        <div>
                            <label class="block text-xs font-medium text-slate-700 mb-1.5" for="new-tag">
                                Tags
                                <span class="text-slate-400 font-normal ml-1">— press Enter or click Add</span>
                            </label>
                            <div class="flex flex-wrap gap-1.5 mb-2 min-h-[1.5rem]">
                                {#each tags as tag, ti}
                                    <span class="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full">
                                        {tag}
                                        <button
                                            type="button"
                                            on:click={() => removeTag(ti)}
                                            class="ml-0.5 hover:text-indigo-900 transition-colors leading-none text-indigo-400"
                                            aria-label="Remove tag"
                                        >×</button>
                                    </span>
                                {/each}
                                {#if tags.length === 0}
                                    <span class="text-xs text-slate-400 italic">No tags yet</span>
                                {/if}
                            </div>
                            <div class="flex gap-2">
                                <input
                                    id="new-tag"
                                    bind:value={newTag}
                                    on:keydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                                    placeholder="e.g. design, tutorial…"
                                    class="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    type="text"
                                >
                                <button
                                    type="button"
                                    on:click={addTag}
                                    class="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors"
                                >Add</button>
                            </div>
                        </div>

                        <!-- Theme Color -->
                        <div>
                            <p class="block text-xs font-medium text-slate-700 mb-2">
                                Theme Color
                                <span class="text-slate-400 font-normal ml-1">— accent color for the post</span>
                            </p>
                            <div class="flex flex-wrap gap-2 items-center">
                                <!-- None / clear -->
                                <button
                                    type="button"
                                    on:click={() => theme = ''}
                                    title="No color"
                                    aria-label="No color"
                                    class={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-150 bg-white ${theme === '' ? 'border-slate-500 scale-110' : 'border-slate-200 hover:border-slate-400 hover:scale-105'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {#each COLOR_PALETTE as color}
                                    <button
                                        type="button"
                                        on:click={() => theme = color.hex}
                                        title={color.label}
                                        aria-label={color.label}
                                        class={`w-7 h-7 rounded-full border-2 border-transparent transition-all duration-150 ${theme === color.hex ? 'scale-125' : 'hover:scale-110'}`}
                                        style="background-color: {color.hex}; {theme === color.hex ? `box-shadow: 0 0 0 2px white, 0 0 0 4px ${color.hex}` : ''}"
                                    ></button>
                                {/each}
                            </div>
                            {#if theme}
                                <p class="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                                    <span class="w-3 h-3 rounded-full inline-block shrink-0" style="background-color: {theme}"></span>
                                    {COLOR_PALETTE.find(c => c.hex === theme)?.label ?? theme}
                                </p>
                            {/if}
                        </div>

                    </div>
                {/if}
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
