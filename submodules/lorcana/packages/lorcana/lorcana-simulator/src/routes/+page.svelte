<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let routeSearch = $state("");

  const routeGroups = $derived([
    {
      title: "Run a Repro",
      description: "Open saved simulator states for quick manual validation.",
      count: data.generalFixtureRouteLinks.length,
      links: data.generalFixtureRouteLinks,
    },
    {
      title: "Regression Work",
      description: "Browse player-reported fixtures and start focused visual checks.",
      count: data.regressionFixtureCount,
      links: [data.regressionRouteLink],
      featured: true,
    },
    {
      title: "Visual Checks",
      description: "Open targeted proof surfaces for player-reported UI reports.",
      count: data.visualValidationRouteLinks.length,
      links: data.visualValidationRouteLinks,
    },
    {
      title: "Live Surfaces",
      description: "Jump to matchmaking, lobbies, and local match setup routes.",
      count: data.staticRouteLinks.length,
      links: data.staticRouteLinks,
    },
  ]);

  const allRouteLinks = $derived(
    [
      ...data.staticRouteLinks,
      data.regressionRouteLink,
      ...data.visualValidationRouteLinks,
      ...data.generalFixtureRouteLinks,
    ].filter((route) => {
      const query = routeSearch.trim().toLowerCase();
      if (!query) return true;

      return `${route.label} ${route.description} ${route.href}`.toLowerCase().includes(query);
    }),
  );
</script>

<svelte:head>
  <title>Lorcana Dev Console</title>
</svelte:head>

<div class="min-h-screen bg-[#09090b] text-[#f4f4f5]">
  <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
    <header class="grid gap-5 border-b border-[#064e3b] pb-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
      <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-[#a1a1aa]">
          <span class="border border-[#047857] bg-[#022c22] px-2 py-1 text-[#a7f3d0]">
            Local development only
          </span>
          <span class="border border-[#92400e] bg-[#451a03] px-2 py-1 text-[#fde68a]">
            Production redirects to /matchmaking
          </span>
        </div>
        <div class="max-w-3xl space-y-2">
          <h1 class="text-3xl font-semibold text-[#fafafa] sm:text-5xl">Lorcana Dev Console</h1>
          <p class="text-base leading-7 text-[#d4d4d8]">
            One place to open simulator fixtures, inspect regression reports, and jump into live
            matchmaking flows without hunting through route files.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-3 border border-[#27272a] bg-[#18181b] text-center shadow-2xl shadow-black">
        <div class="border-r border-[#27272a] p-3">
          <p class="text-2xl font-semibold text-[#a7f3d0]">{data.generalFixtureRouteLinks.length}</p>
          <p class="text-xs uppercase text-[#71717a]">fixtures</p>
        </div>
        <div class="border-r border-[#27272a] p-3">
          <p class="text-2xl font-semibold text-[#fde68a]">{data.regressionFixtureCount}</p>
          <p class="text-xs uppercase text-[#71717a]">regressions</p>
        </div>
        <div class="p-3">
          <p class="text-2xl font-semibold text-[#bae6fd]">{data.staticRouteLinks.length}</p>
          <p class="text-xs uppercase text-[#71717a]">tools</p>
        </div>
      </div>
    </header>

    <section class="grid gap-3 lg:grid-cols-3">
      {#each routeGroups as group}
        <div
          class="border border-[#27272a] bg-[#18181b] p-4 shadow-xl shadow-black {group.featured
            ? 'ring-2 ring-[#fcd34d]'
            : ''}"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-[#fafafa]">{group.title}</h2>
              <p class="mt-1 text-sm leading-6 text-[#a1a1aa]">{group.description}</p>
            </div>
            <span class="border border-[#3f3f46] bg-[#000000] px-2 py-1 text-xs text-[#d4d4d8]">
              {group.count}
            </span>
          </div>

          <div class="mt-4 space-y-2">
            {#each group.links.slice(0, 4) as route}
              <a
                href={route.href}
                class="flex items-center justify-between gap-3 border border-[#27272a] bg-[#000000] px-3 py-2 text-sm transition hover:border-[#6ee7b7] hover:bg-[#022c22]"
              >
                <span class="font-medium text-[#f4f4f5]">{route.label}</span>
                <span class="text-[#6ee7b7]">-></span>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </section>

    <section class="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside class="space-y-4">
        <div class="border border-[#27272a] bg-[#18181b] p-4">
          <h2 class="text-sm font-semibold uppercase text-[#a7f3d0]">Process</h2>
          <ol class="mt-3 space-y-3 text-sm leading-6 text-[#d4d4d8]">
            <li><span class="font-semibold text-[#fafafa]">1.</span> Start from a fixture route.</li>
            <li><span class="font-semibold text-[#fafafa]">2.</span> Confirm the visual state.</li>
            <li><span class="font-semibold text-[#fafafa]">3.</span> Add only the missing assertion.</li>
          </ol>
        </div>

        <div class="border border-[#27272a] bg-[#18181b] p-4">
          <h2 class="text-sm font-semibold uppercase text-[#bae6fd]">Parameterized</h2>
          <div class="mt-3 space-y-2">
            {#each data.routePatterns as route}
              <div class="border border-dashed border-[#3f3f46] bg-[#000000] p-3">
                <p class="font-mono text-xs text-[#f4f4f5]">{route.pattern}</p>
                <p class="mt-1 text-xs leading-5 text-[#a1a1aa]">{route.description}</p>
              </div>
            {/each}
          </div>
        </div>
      </aside>

      <section class="space-y-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-xl font-semibold text-[#fafafa]">Route Directory</h2>
            <p class="text-sm text-[#a1a1aa]">Search by label, route, fixture id, or report text.</p>
          </div>
          <label class="block w-full sm:w-80">
            <span class="sr-only">Search routes</span>
            <input
              bind:value={routeSearch}
              type="search"
              placeholder="Search routes"
              class="w-full border border-[#3f3f46] bg-[#09090b] px-3 py-2 text-sm text-[#f4f4f5] outline-none transition placeholder:text-[#71717a] focus:border-[#6ee7b7]"
            />
          </label>
        </div>

        <div class="overflow-hidden border border-[#27272a] bg-[#18181b] shadow-xl shadow-black">
          {#each allRouteLinks as route}
            <a
              href={route.href}
              class="grid gap-2 border-b border-[#27272a] px-4 py-3 transition last:border-b-0 hover:bg-[#27272a] md:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)_minmax(11rem,18rem)] md:items-center"
            >
              <span class="font-medium text-[#f4f4f5]">{route.label}</span>
              <span class="text-sm leading-6 text-[#a1a1aa]">{route.description}</span>
              <span class="break-all font-mono text-xs text-[#6ee7b7]/80">{route.href}</span>
            </a>
          {/each}
          {#if allRouteLinks.length === 0}
            <div class="px-4 py-8 text-sm text-[#a1a1aa]">No routes match that search.</div>
          {/if}
        </div>
      </section>
    </section>
  </div>
</div>
