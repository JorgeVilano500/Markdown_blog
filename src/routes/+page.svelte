<script lang="ts">
    import { invalidate } from '$app/navigation';

    import FormComponent from '../components/FormComponent.svelte';
    import FormHistoryComponent from '../components/FormHistoryComponent.svelte'

    type Post = {
        id: String;
        title: String;
        created_at: String;
        content: String;
        published: boolean;
        cover_emoji: String | null;
        excerpt: String | null;
        tags: string[] | null;
        theme: string | null;
    }
    export let data: { posts: Post[] }

    let blogs = data.posts
    let title = '';
    let content = '';
    let activeView: 'new-post' | 'posts' = 'new-post';

    async function deletePost(id: string) {
        const formData = new FormData();
        formData.append('id', id)
        const res = await fetch('?/delete', { method: 'POST', body: formData })
        if (res.ok) {
            blogs = blogs.filter(blog => blog.id !== id)
            await invalidate('/');
        } else {
            console.error('Delete failed')
        }
    }

    async function editPost(title: string, content: string, id: string, cover_emoji?: string, excerpt?: string, tags?: string[], theme?: string) {
        const formData = new FormData();
        formData.append('title', title)
        formData.append('content', content)
        formData.append('id', id);
        if (cover_emoji !== undefined) formData.append('cover_emoji', cover_emoji)
        if (excerpt     !== undefined) formData.append('excerpt', excerpt)
        if (tags        !== undefined) formData.append('tags', JSON.stringify(tags))
        if (theme       !== undefined) formData.append('theme', theme)

        const res = await fetch('?/editBlog', { method: 'POST', body: formData })
        if (res.ok) {
            blogs = blogs.map(blog => {
                if (blog.id === id) return { ...blog, content, title, cover_emoji: cover_emoji ?? blog.cover_emoji, excerpt: excerpt ?? blog.excerpt, tags: tags ?? blog.tags, theme: theme ?? blog.theme }
                return blog;
            })
            await invalidate('/')
        } else {
            const body = await res.json().catch(() => null)
            const message = body?.data?.error ?? `HTTP ${res.status}`
            console.error('Edit failed:', message)
            window.alert(`Edit failed: ${message}`)
        }
    }

    async function togglePublic(id: string, current: boolean) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('published', String(!current));

        const res = await fetch('?/togglePublic', { method: 'POST', body: formData })
        if (res.ok) {
            blogs = blogs.map(blog => blog.id === id ? { ...blog, published: !current } : blog)
        } else {
            const body = await res.json().catch(() => null)
            console.error('Toggle failed:', body?.data?.error ?? `HTTP ${res.status}`)
        }
    }

    async function addPost(title: string, content: string, file?: File[], cover_emoji?: string, excerpt?: string, tags?: string[], theme?: string) {
        const formData = new FormData();
        formData.append('title', title)
        formData.append('content', content)
        if (file) {
            file.forEach((f: File) => formData.append('files[]', f as Blob))
        }
        if (cover_emoji) formData.append('cover_emoji', cover_emoji)
        if (excerpt)     formData.append('excerpt', excerpt)
        if (tags?.length) formData.append('tags', JSON.stringify(tags))
        if (theme)       formData.append('theme', theme)

        const res = await fetch('?/addBlog', { method: 'POST', body: formData })
        if (res.ok) {
            const blogResponse = await res.json()
            const parsed = JSON.parse(blogResponse.data)
            const newBlog = {
                id: parsed[4],
                created_at: parsed[5],
                content: parsed[6],
                title: parsed[7],
                published: false,
                cover_emoji: cover_emoji ?? null,
                excerpt: excerpt ?? null,
                tags: tags ?? null,
                theme: theme ?? null
            }
            blogs.push(newBlog)
            await invalidate('/');
        } else {
            console.error('Add post failed')
        }
    }
</script>

<svelte:head>
    <title>Blog CMS</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex h-screen bg-slate-50 overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-56 bg-slate-900 flex flex-col shrink-0">
        <div class="px-5 py-5 border-b border-slate-700/60">
            <p class="text-white font-semibold text-base tracking-tight">Markdown Blog</p>
            <p class="text-slate-400 text-xs mt-0.5">Content Manager</p>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1">
            <button
                on:click={() => activeView = 'new-post'}
                class={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeView === 'new-post' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Post
            </button>

            <button
                on:click={() => activeView = 'posts'}
                class={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeView === 'posts' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                All Posts
                <span class="ml-auto bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">{blogs.length}</span>
            </button>
        </nav>

        <div class="px-5 py-4 border-t border-slate-700/60">
            <p class="text-slate-500 text-xs">v1.0</p>
        </div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <header class="bg-white border-b border-slate-200 px-8 py-4 shrink-0">
            <h1 class="text-lg font-semibold text-slate-800">
                {activeView === 'new-post' ? 'New Post' : 'All Posts'}
            </h1>
        </header>

        <main class="flex-1 overflow-y-auto p-8">
            {#if activeView === 'new-post'}
                <FormComponent {title} {content} {addPost} />
            {:else}
                <FormHistoryComponent {editPost} {deletePost} {togglePublic} {blogs} />
            {/if}
        </main>
    </div>
</div>
