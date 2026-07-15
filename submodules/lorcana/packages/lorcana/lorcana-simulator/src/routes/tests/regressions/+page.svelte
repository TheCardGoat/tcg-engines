<script lang="ts">
  import { LORCANA_REGRESSION_FIXTURE_LIST } from "@/features/simulator-devtools/fixtures/regressions";
  import { buildRegressionFixtureTestRouteHref } from "@/features/simulator-devtools/routes/test-routes.js";

  type RegressionLink = {
    href: string;
    playerOneHref: string;
    playerTwoHref: string;
    id: string;
    name: string;
    description: string;
    batch: string;
  };

  let search = $state("");
  let activeBatch = $state("All");

  const regressionLinks = LORCANA_REGRESSION_FIXTURE_LIST.map((fixture) => ({
    href: buildRegressionFixtureTestRouteHref(fixture.id),
    playerOneHref: `${buildRegressionFixtureTestRouteHref(fixture.id)}?view=playerOne`,
    playerTwoHref: `${buildRegressionFixtureTestRouteHref(fixture.id)}?view=playerTwo`,
    id: fixture.id,
    name: fixture.name,
    description: fixture.description,
    batch: getRegressionBatch(fixture.id),
  })) satisfies RegressionLink[];

  const batchFilters = $derived([
    "All",
    ...Array.from(new Set(regressionLinks.map((fixture) => fixture.batch))),
  ]);

  const filteredRegressionLinks = $derived(
    regressionLinks.filter((fixture) => {
      const query = search.trim().toLowerCase();
      const matchesBatch = activeBatch === "All" || fixture.batch === activeBatch;
      const matchesSearch =
        !query ||
        `${fixture.id} ${fixture.name} ${fixture.description} ${fixture.batch}`
          .toLowerCase()
          .includes(query);

      return matchesBatch && matchesSearch;
    }),
  );

  const latestFixture = regressionLinks[regressionLinks.length - 1];

  function getRegressionBatch(fixtureId: string): string {
    const dateMatch = fixtureId.match(/20\d{2}-\d{2}-\d{2}/);
    if (dateMatch) return dateMatch[0];

    const bugMatch = fixtureId.match(/^bug-(\d+)/);
    if (!bugMatch) return "Manual";

    const bugNumber = Number(bugMatch[1]);
    if (bugNumber <= 46) return "2026-04-22";
    if (bugNumber <= 70) return "2026-05-04";

    return "Bug backlog";
  }
</script>

<svelte:head>
  <title>Regression Fixtures</title>
</svelte:head>

<div class="min-h-screen bg-[#09090b] text-[#f4f4f5]">
  <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-7 px-4 py-6 sm:px-6 lg:px-8">
    <header class="grid gap-5 border-b border-[#064e3b] pb-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
      <div class="space-y-3">
        <a href="/" class="text-sm font-medium text-[#6ee7b7] underline-offset-4 hover:underline">
          Back to dev console
        </a>
        <div class="max-w-4xl space-y-2">
          <h1 class="text-3xl font-semibold text-[#fafafa] sm:text-5xl">Regression Fixtures</h1>
          <p class="text-base leading-7 text-[#d4d4d8]">
            Saved player-reported board states. Search first, reuse an existing setup when the board
            is the same, and add only the missing engine or browser assertion.
          </p>
        </div>
      </div>

      <div class="border border-[#27272a] bg-[#18181b] p-4 shadow-2xl shadow-black">
        <p class="text-sm uppercase text-[#71717a]">Total cases</p>
        <p class="mt-1 text-4xl font-semibold text-[#fde68a]">{regressionLinks.length}</p>
        {#if latestFixture}
          <a
            href={latestFixture.href}
            class="mt-3 block border border-[#92400e] bg-[#451a03] px-3 py-2 text-sm font-medium text-[#fef3c7] hover:bg-[#78350f]"
          >
            Open latest: {latestFixture.name}
          </a>
        {/if}
      </div>
    </header>

    <section class="grid gap-3 lg:grid-cols-3">
      <div class="border border-[#27272a] bg-[#18181b] p-4 shadow-xl shadow-black">
        <h2 class="text-sm font-semibold uppercase text-[#a7f3d0]">1. Save</h2>
        <p class="mt-2 text-sm leading-6 text-[#d4d4d8]">
          Put one fixture in
          <span class="font-mono text-xs text-[#fafafa]">fixtures/regressions/&lt;date&gt;/&lt;slug&gt;.ts</span>
          and register it once.
        </p>
      </div>
      <div class="border border-[#27272a] bg-[#18181b] p-4 shadow-xl shadow-black">
        <h2 class="text-sm font-semibold uppercase text-[#bae6fd]">2. Assert</h2>
        <p class="mt-2 text-sm leading-6 text-[#d4d4d8]">
          Use <span class="font-mono text-xs text-[#fafafa]">createRegressionTestEngine</span> for
          engine checks or <span class="font-mono text-xs text-[#fafafa]">buildRegressionFixturePath</span>
          for browser checks.
        </p>
      </div>
      <div class="border border-[#27272a] bg-[#18181b] p-4 shadow-xl shadow-black">
        <h2 class="text-sm font-semibold uppercase text-[#fde68a]">3. Keep</h2>
        <p class="mt-2 text-sm leading-6 text-[#d4d4d8]">
          Keep the fixture after the fix so the route remains a manual proof surface for future
          changes.
        </p>
      </div>
    </section>

    <section class="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside class="space-y-4">
        <label class="block">
          <span class="text-sm font-semibold text-[#d4d4d8]">Search</span>
          <input
            bind:value={search}
            type="search"
            placeholder="Card, bug, slug"
            class="mt-2 w-full border border-[#3f3f46] bg-[#09090b] px-3 py-2 text-sm text-[#f4f4f5] outline-none transition placeholder:text-[#71717a] focus:border-[#6ee7b7]"
          />
        </label>

        <div class="border border-[#27272a] bg-[#18181b] p-3">
          <h2 class="px-1 text-sm font-semibold text-[#d4d4d8]">Batch</h2>
          <div class="mt-2 flex flex-col gap-1">
            {#each batchFilters as batch}
              <button
                type="button"
                onclick={() => (activeBatch = batch)}
                class="flex items-center justify-between border px-3 py-2 text-left text-sm transition {activeBatch ===
                batch
                  ? 'border-[#6ee7b7] bg-[#064e3b] text-[#d1fae5]'
                  : 'border-transparent text-[#d4d4d8] hover:border-[#3f3f46] hover:bg-[#27272a]'}"
              >
                <span>{batch}</span>
                <span class="text-xs opacity-70">
                  {batch === "All"
                    ? regressionLinks.length
                    : regressionLinks.filter((fixture) => fixture.batch === batch).length}
                </span>
              </button>
            {/each}
          </div>
        </div>
      </aside>

      <section class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-semibold text-[#fafafa]">Cases</h2>
            <p class="text-sm text-[#a1a1aa]">
              Showing {filteredRegressionLinks.length} of {regressionLinks.length}
            </p>
          </div>
          <a
            href="/"
            class="border border-[#3f3f46] bg-[#18181b] px-3 py-2 text-sm font-medium text-[#f4f4f5] hover:bg-[#27272a]"
          >
            Dev console
          </a>
        </div>

        <div class="overflow-hidden border border-[#27272a] bg-[#18181b] shadow-xl shadow-black">
          {#each filteredRegressionLinks as regression}
            <article class="grid gap-3 border-b border-[#27272a] p-4 last:border-b-0 hover:bg-[#27272a] xl:grid-cols-[8rem_minmax(0,1fr)_12rem] xl:items-center">
              <div>
                <p class="text-xs font-semibold uppercase text-[#fde68a]/80">{regression.batch}</p>
                <p class="mt-1 break-all font-mono text-xs text-[#6ee7b7]/70">{regression.id}</p>
              </div>

              <div class="min-w-0">
                <h3 class="text-base font-semibold text-[#fafafa]">{regression.name}</h3>
                <p class="mt-1 line-clamp-2 text-sm leading-6 text-[#a1a1aa]">
                  {regression.description}
                </p>
              </div>

              <div class="grid grid-cols-3 gap-1 text-sm xl:grid-cols-1">
                <a
                  href={regression.href}
                  class="border border-[#6ee7b7] bg-[#022c22] px-3 py-2 text-center font-medium text-[#d1fae5] hover:bg-[#064e3b]"
                >
                  Open
                </a>
                <a
                  href={regression.playerOneHref}
                  class="border border-[#3f3f46] px-3 py-2 text-center text-[#d4d4d8] hover:bg-[#27272a]"
                >
                  P1
                </a>
                <a
                  href={regression.playerTwoHref}
                  class="border border-[#3f3f46] px-3 py-2 text-center text-[#d4d4d8] hover:bg-[#27272a]"
                >
                  P2
                </a>
              </div>
            </article>
          {/each}

          {#if filteredRegressionLinks.length === 0}
            <div class="p-8 text-sm text-[#a1a1aa]">No regression fixtures match that filter.</div>
          {/if}
        </div>
      </section>
    </section>
  </div>
</div>
