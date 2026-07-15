<script lang="ts">
  import { page } from "$app/state";
  import { locales, localizeHref } from "$lib/paraglide/runtime";
  import { theme } from "$lib/theme.svelte";
  import { onMount } from "svelte";
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();

  onMount(() => {
    theme.hydrate();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon}>
</svelte:head>

{@render children()}
<div style="display:none">
  {#each locales as locale}
    <a href={localizeHref(page.url.pathname, { locale })}> {locale} </a>
  {/each}
</div>
