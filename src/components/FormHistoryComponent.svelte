<script lang="ts">
    import { marked } from '$lib/markdown';

    let showPreview  = false;
    let showSettings = false;
    let title:       string;
    let content:     string;
    let cover_emoji: string;
    let excerpt:     string;
    let tags:        string[] = [];
    let theme:       string   = '';
    let newTag:      string   = '';
    let editIndex:   number;
    let onEdit = false;

    export let editPost;
    export let deletePost;
    export let togglePublic;
    export let blogs;

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

    const handleSubmit = (id: string) => {
        editPost(title, content, id, cover_emoji, excerpt, tags, theme);
        onEdit = false;
        showSettings = false;
    }

    const enterEdit = (blog: any, i: number) => {
        onEdit       = true;
        editIndex    = i;
        title        = blog.title        ?? '';
        content      = blog.content      ?? '';
        cover_emoji  = blog.cover_emoji  ?? '';
        excerpt      = blog.excerpt      ?? '';
        tags         = blog.tags         ?? [];
        theme        = blog.theme        ?? '';
        newTag       = '';
        showPreview  = false;
        showSettings = false;
    }

    const cancelEdit = () => {
        onEdit       = false;
        showPreview  = false;
        showSettings = false;
        newTag       = '';
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
                    <div class="min-w-0 flex items-start gap-3">
                        {#if blog.cover_emoji}
                            <span class="text-2xl leading-none mt-0.5 shrink-0">{blog.cover_emoji}</span>
                        {/if}
                        <div class="min-w-0">
                            <h2 class="text-base font-semibold text-slate-800 truncate">{blog.title}</h2>
                            <p class="text-xs text-slate-400 mt-0.5">
                                {new Date(String(blog.created_at)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 shrink-0">

                        <!-- Public / Draft toggle pill -->
                        <button
                            on:click={() => togglePublic(blog.id, blog.published)}
                            title={blog.published ? 'Click to unpublish' : 'Click to publish'}
                            class={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                                blog.published
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                            }`}
                        >
                            <span class={`w-1.5 h-1.5 rounded-full ${blog.published ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            {blog.published ? 'Public' : 'Draft'}
                        </button>

                        {#if onEdit && editIndex === i}
                            <button
                                on:click={cancelEdit}
                                class="text-xs px-3 py-1.5 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                            >Cancel</button>
                            <button
                                on:click={() => handleSubmit(blog.id)}
                                class="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                            >Save</button>
                        {:else}
                            <button
                                on:click={() => enterEdit(blog, i)}
                                class="text-xs px-3 py-1.5 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                            >Edit</button>
                        {/if}

                        <button
                            on:click={() => deletePost(blog.id)}
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

                        <!-- Write / Preview tabs -->
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

                        <!-- Post Settings accordion -->
                        <div class="mt-4 rounded-lg border border-slate-200 overflow-hidden">
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
                                            <label class="block text-xs font-medium text-slate-700 mb-1.5" for="edit-emoji-{i}">Cover Emoji</label>
                                            <input
                                                id="edit-emoji-{i}"
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
                                        <label class="block text-xs font-medium text-slate-700 mb-1.5" for="edit-excerpt-{i}">
                                            Excerpt
                                            <span class="text-slate-400 font-normal ml-1">— shown in post previews</span>
                                        </label>
                                        <textarea
                                            id="edit-excerpt-{i}"
                                            bind:value={excerpt}
                                            rows="3"
                                            placeholder="A short summary of this post…"
                                            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        ></textarea>
                                    </div>

                                    <!-- Tags -->
                                    <div>
                                        <label class="block text-xs font-medium text-slate-700 mb-1.5" for="edit-tag-{i}">
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
                                                id="edit-tag-{i}"
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

                    {:else}
                        <!-- Content preview with fade -->
                        <div class="relative">
                            <div class="prose prose-sm max-w-none max-h-36 overflow-hidden text-slate-600">
                                {@html marked.parse(blog?.content)}
                            </div>
                            <div class="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                        </div>
                        {#if blog.excerpt}
                            <p class="mt-3 text-xs text-slate-500 italic border-t border-slate-100 pt-3">{blog.excerpt}</p>
                        {/if}
                    {/if}
                </div>

            </div>
        {/each}
    </div>
{/if}
