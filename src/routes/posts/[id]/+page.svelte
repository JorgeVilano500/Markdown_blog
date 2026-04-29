<script lang="ts">
    import { marked } from '$lib/markdown';
    import { extractDescription, extractFirstImage } from '$lib/seo';

    export let data: {
        post: { id: string; title: string; content: string; created_at: string };
        siteUrl: string;
    };

    const { post, siteUrl } = data;

    const postUrl     = `${siteUrl}/posts/${post.id}`;
    const description = extractDescription(post.content);
    const ogImage     = extractFirstImage(post.content) ?? `${siteUrl}/og-default.png`;
    const publishedAt = new Date(post.created_at);
    const dateLabel   = publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const html = marked.parse(post.content) as string;

    const structuredData = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description,
        url: postUrl,
        datePublished: publishedAt.toISOString(),
        ...(extractFirstImage(post.content) ? { image: [extractFirstImage(post.content)] } : {})
    });
</script>

<svelte:head>
    <!-- Core -->
    <title>{post.title} | Markdown Blog</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={postUrl} />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph — drives iMessage, Slack, Discord, Facebook previews -->
    <meta property="og:type"                content="article" />
    <meta property="og:url"                 content={postUrl} />
    <meta property="og:title"               content={post.title} />
    <meta property="og:description"         content={description} />
    <meta property="og:image"               content={ogImage} />
    <meta property="og:image:width"         content="1200" />
    <meta property="og:image:height"        content="630" />
    <meta property="article:published_time" content={publishedAt.toISOString()} />

    <!-- Twitter / X Cards -->
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:title"       content={post.title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image"       content={ogImage} />

    <!-- JSON-LD structured data for Google -->
    {@html `<script type="application/ld+json">${structuredData}<\/script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50">
    <div class="max-w-3xl mx-auto px-6 py-12">

        <!-- Back link -->
        <a href="/" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
        </a>

        <!-- Header -->
        <header class="mb-10">
            <h1 class="text-4xl font-bold text-slate-900 leading-tight mb-3">{post.title}</h1>
            <time datetime={publishedAt.toISOString()} class="text-sm text-slate-400">{dateLabel}</time>
        </header>

        <hr class="border-slate-200 mb-10" />

        <!-- Content -->
        <article class="prose prose-slate max-w-none">
            {@html html}
        </article>

    </div>
</div>
