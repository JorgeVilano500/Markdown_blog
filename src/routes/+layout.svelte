<script>
    let { children } = $props();
    import "../app.css";
</script>

<svelte:head>
    <meta property="og:site_name" content="Markdown Blog" />
    <meta property="og:locale"    content="en_US" />
</svelte:head>

{@render children()}
