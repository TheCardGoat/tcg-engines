<script lang="ts">
  import { page } from "$app/state";
  import type { PageData } from "./$types";
  import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
  import { loadLorcanaFixture } from "@/features/simulator-devtools/fixtures";
  import { normalizeView } from "@/features/simulator-devtools/harness/browser-route";

  let { data }: { data: PageData } = $props();

  const fixturePromise = $derived(loadLorcanaFixture(data.fixtureId));
  const routeView = $derived(normalizeView(page.url.searchParams.get("view")));
</script>

{#await fixturePromise}
  <main class="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-300">
    Loading fixture...
  </main>
{:then fixture}
  {#if fixture}
    <LorcanaBrowserHarnessView {fixture} view={routeView} aiBot={false} />
  {:else}
    <main class="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-red-200">
      Fixture not found.
    </main>
  {/if}
{:catch error}
  <main class="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-red-200">
    {error instanceof Error ? error.message : "Unable to load fixture."}
  </main>
{/await}
