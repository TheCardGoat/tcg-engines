<script lang="ts">
  import { CardImage } from "@tcg/core-ui";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  // Constants
  const inks = ["amber", "amethyst", "emerald", "ruby", "sapphire", "steel"];
  const costs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Simplified for now
  const types = ["character", "action", "item", "location"];
  const inkClasses: Record<string, string> = {
    amber:
      "bg-amber-500/20 border-amber-500 text-amber-200 shadow-[0_0_10px_rgba(var(--color-amber-500),0.3)]",
    amethyst:
      "bg-amethyst-500/20 border-amethyst-500 text-amethyst-200 shadow-[0_0_10px_rgba(var(--color-amethyst-500),0.3)]",
    emerald:
      "bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-[0_0_10px_rgba(var(--color-emerald-500),0.3)]",
    ruby: "bg-ruby-500/20 border-ruby-500 text-ruby-200 shadow-[0_0_10px_rgba(var(--color-ruby-500),0.3)]",
    sapphire:
      "bg-sapphire-500/20 border-sapphire-500 text-sapphire-200 shadow-[0_0_10px_rgba(var(--color-sapphire-500),0.3)]",
    steel:
      "bg-steel-500/20 border-steel-500 text-steel-200 shadow-[0_0_10px_rgba(var(--color-steel-500),0.3)]",
  };
  const STORAGE_KEY = "lorcana-filters";

  // Helper to parse URL params
  function getParamsFromUrl(url: URL) {
    return {
      q: url.searchParams.get("q") || "",
      ink: url.searchParams.getAll("ink"),
      cost: url.searchParams.getAll("cost").map(Number),
      type: url.searchParams.getAll("type"),
      set: url.searchParams.getAll("set"),
      crop:
        (url.searchParams.get("crop") as
          | "full"
          | "art_only"
          | "art_and_name") || "full",
      logic: (url.searchParams.get("logic") as "AND" | "OR") || "AND",
    };
  }

  // Initial state from URL (SSR safe)
  const initialParams = getParamsFromUrl($page.url);

  // State
  let searchQuery = $state(initialParams.q);
  let selectedInk = $state<string[]>(initialParams.ink);
  let selectedCost = $state<number[]>(initialParams.cost);
  let selectedType = $state<string[]>(initialParams.type);
  let selectedSets = $state<string[]>(initialParams.set);
  let selectedCrop = $state<"full" | "art_only" | "art_and_name">(
    initialParams.crop,
  );
  let filterLogic = $state<"AND" | "OR">(initialParams.logic);

  let isInitialized = false;

  // Hydrate from session storage if URL params are empty
  onMount(() => {
    if (!browser) return;

    const hasUrlParams = $page.url.searchParams.toString().length > 0;
    if (!hasUrlParams) {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const s = JSON.parse(stored);
          searchQuery = s.q ?? "";
          selectedInk = s.ink ?? [];
          selectedCost = s.cost ?? [];
          selectedType = s.type ?? [];
          selectedSets = s.set ?? [];
          selectedCrop = s.crop ?? "full";
          filterLogic = s.logic ?? "AND";
        } catch (e) {
          console.error("Failed to parse session storage", e);
        }
      }
    }
    isInitialized = true;
  });

  // Sync state to URL and SessionStorage
  $effect(() => {
    if (!(browser && isInitialized)) return;

    const state = {
      q: searchQuery,
      ink: selectedInk,
      cost: selectedCost,
      type: selectedType,
      set: selectedSets,
      crop: selectedCrop,
      logic: filterLogic,
    };

    // 1. Persist to Session Storage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // 2. Update URL
    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    for (const i of state.ink) params.append("ink", i);
    for (const c of state.cost) params.append("cost", c.toString());
    for (const t of state.type) params.append("type", t);
    for (const s of state.set) params.append("set", s);
    if (state.crop !== "full") params.set("crop", state.crop);
    if (state.logic !== "AND") params.set("logic", state.logic);

    const queryString = params.toString();
    const currentUrl = $page.url.searchParams.toString();

    if (queryString !== currentUrl) {
      // use replaceState to avoid cluttering history stack for every filter change
      goto(`?${queryString}`, {
        replaceState: true,
        keepFocus: true,
        noScroll: true,
      });
    }
  });

  // Reactive filtered cards
  const availableSets = $derived.by(() => {
    const sets = new Set<string>();
    data.cards.forEach((c: { paramSet?: string }) => {
      if (c.paramSet) sets.add(c.paramSet);
    });
    return Array.from(sets).sort();
  });

  const filteredCards = $derived.by(() => {
    const cards = data.cards;

    // Text search (always AND)
    let result = cards;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c: { name?: string; fullName?: string; text?: string }) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.fullName && c.fullName.toLowerCase().includes(q)) ||
          (c.text && c.text.toLowerCase().includes(q)),
      );
    }

    // Property filters
    const hasInk = selectedInk.length > 0;
    const hasCost = selectedCost.length > 0;
    const hasType = selectedType.length > 0;
    const hasSet = selectedSets.length > 0;

    if (!(hasInk || hasCost || hasType || hasSet)) {
      return result;
    }

    return result.filter(
      (c: {
        inkType?: string[];
        cardType?: string;
        cost: number;
        paramSet?: string;
      }) => {
        // Helper to check individual criteria
        // Normalize to lowercase for comparison just in case
        // inkType is always an array in the current type system
        const cInk = c.inkType
          ? c.inkType.map((k: string) => k.toLowerCase())
          : [];
        const cType = c.cardType ? c.cardType.toLowerCase() : "";

        const matchInk = hasInk
          ? cInk.some((i: string) => selectedInk.includes(i))
          : false;
        const matchCost = hasCost ? selectedCost.includes(c.cost) : false;
        const matchType = hasType ? selectedType.includes(cType) : false;
        const matchSet = hasSet
          ? c.paramSet
            ? selectedSets.includes(c.paramSet)
            : false
          : false;

        if (filterLogic === "AND") {
          if (hasInk && !matchInk) return false;
          if (hasCost && !matchCost) return false;
          if (hasType && !matchType) return false;
          if (hasSet && !matchSet) return false;
          return true;
        }
        // OR logic
        return matchInk || matchCost || matchType || matchSet;
      },
    );
  });

  function toggleInk(ink: string) {
    selectedInk = selectedInk.includes(ink)
      ? selectedInk.filter((i) => i !== ink)
      : [...selectedInk, ink];
  }

  function toggleCost(cost: number) {
    selectedCost = selectedCost.includes(cost)
      ? selectedCost.filter((c) => c !== cost)
      : [...selectedCost, cost];
  }

  function toggleType(type: string) {
    selectedType = selectedType.includes(type)
      ? selectedType.filter((t) => t !== type)
      : [...selectedType, type];
  }

  function toggleSet(set: string) {
    selectedSets = selectedSets.includes(set)
      ? selectedSets.filter((s) => s !== set)
      : [...selectedSets, set];
  }
</script>

<div
  class="min-h-screen bg-slate-900 font-sans text-slate-100 selection:bg-purple-500 selection:text-white"
>
  <!-- Header -->
  <header
    class="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 shadow-xl backdrop-blur-sm"
  >
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"
    >
      <div>
        <h1
          class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent"
        >
          Lorcana Database
        </h1>
        <p class="text-sm text-slate-400">Discover and build your collection</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="group relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <svg
              class="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search cards..."
            class="block w-full rounded-lg border-0 bg-slate-800 py-2 pr-4 pl-10 text-slate-100 placeholder-slate-500 shadow-sm ring-1 ring-slate-700 transition-shadow ring-inset focus:ring-2 focus:ring-purple-500 focus:ring-inset sm:text-sm sm:leading-6"
          >
        </div>
      </div>
    </div>
  </header>

  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <!-- Filters Sidebar -->
      <aside class="space-y-8 lg:col-span-1">
        <!-- Logic Toggle -->
        <div
          class="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm"
        >
          <span
            class="mb-3 block text-xs font-semibold tracking-wider text-slate-500 uppercase"
            >Logic</span
          >
          <div class="grid grid-cols-2 gap-2 rounded-lg bg-slate-900 p-1">
            <button
              class="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-all {filterLogic ===
							'AND'
								? 'bg-purple-600 text-white shadow-lg'
								: 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
              onclick={() => (filterLogic = 'AND')}
            >
              AND
            </button>
            <button
              class="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-all {filterLogic ===
							'OR'
								? 'bg-purple-600 text-white shadow-lg'
								: 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
              onclick={() => (filterLogic = 'OR')}
            >
              OR
            </button>
          </div>
        </div>

        <!-- Crop Toggle -->
        <div
          class="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur-sm"
        >
          <span
            class="mb-3 block text-xs font-semibold tracking-wider text-slate-500 uppercase"
            >Image Crop</span
          >
          <div class="grid grid-cols-1 gap-2">
            <select
              class="block w-full rounded-md border-0 bg-slate-900 py-1.5 text-slate-100 shadow-sm ring-1 ring-slate-700 ring-inset focus:ring-2 focus:ring-purple-600 focus:ring-inset sm:text-xs sm:leading-6"
              bind:value={selectedCrop}
              data-testid="crop-select"
            >
              <option value="full">Full Card</option>
              <option value="art_only">Art Only</option>
              <option value="art_and_name">Art + Name</option>
            </select>
          </div>
        </div>

        <!-- Ink Filter -->
        <div>
          <h3
            class="mb-3 text-sm font-semibold tracking-wider text-slate-500 uppercase"
          >
            Ink
          </h3>
          <div class="flex flex-wrap gap-2">
            {#each inks as ink}
              <button
                class="cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-all duration-200
								{selectedInk.includes(ink)
									? inkClasses[ink]
									: 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-300'}"
                onclick={() => toggleInk(ink)}
                data-testid="filter-ink-{ink}"
              >
                {ink}
              </button>
            {/each}
          </div>
        </div>

        <!-- Cost Filter -->
        <div>
          <h3
            class="mb-3 text-sm font-semibold tracking-wider text-slate-500 uppercase"
          >
            Cost
          </h3>
          <div class="flex flex-wrap gap-2">
            {#each costs as cost}
              <button
                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-xs font-bold transition-all duration-200
								{selectedCost.includes(cost)
									? 'border-amber-500 bg-amber-500/20 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
									: 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-300'}"
                onclick={() => toggleCost(cost)}
                data-testid="filter-cost-{cost}"
              >
                {cost}
              </button>
            {/each}
          </div>
        </div>

        <!-- Type Filter -->
        <div>
          <h3
            class="mb-3 text-sm font-semibold tracking-wider text-slate-500 uppercase"
          >
            Type
          </h3>
          <div class="flex flex-col gap-2">
            {#each types as type}
              <label
                class="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-800/50"
              >
                <div class="relative flex items-center">
                  <input
                    type="checkbox"
                    class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-900 transition-all checked:border-purple-500 checked:bg-purple-500 focus:ring-0 focus:ring-offset-0"
                    checked={selectedType.includes(type)}
                    onchange={() => toggleType(type)}
                  >
                  <svg
                    class="pointer-events-none absolute inset-0 m-auto hidden h-3 w-3 text-white peer-checked:block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span
                  class="text-sm text-slate-400 capitalize transition-colors group-hover:text-slate-200"
                  >{type}</span
                >
              </label>
            {/each}
          </div>
        </div>

        <!-- Set Filter -->
        <div>
          <h3
            class="mb-3 text-sm font-semibold tracking-wider text-slate-500 uppercase"
          >
            Set
          </h3>
          <div class="flex flex-col gap-2">
            {#each availableSets as set}
              <label
                class="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-800/50"
              >
                <div class="relative flex items-center">
                  <input
                    type="checkbox"
                    class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-900 transition-all checked:border-purple-500 checked:bg-purple-500 focus:ring-0 focus:ring-offset-0"
                    checked={selectedSets.includes(set)}
                    onchange={() => toggleSet(set)}
                  >
                  <svg
                    class="pointer-events-none absolute inset-0 m-auto hidden h-3 w-3 text-white peer-checked:block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span
                  class="text-sm text-slate-400 capitalize transition-colors group-hover:text-slate-200"
                  >{set}</span
                >
              </label>
            {/each}
          </div>
        </div>
      </aside>

      <!-- Card Grid -->
      <section class="lg:col-span-3">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-medium text-slate-200">
            Results
            <span
              class="ml-2 inline-flex items-center justify-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400"
              >{filteredCards.length}</span
            >
          </h2>
        </div>

        <div
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
        >
          {#each filteredCards.slice(0, 100) as card (card.id)}
            <!-- Limiting to 100 for perf in MVP -->
            <div
              class="group relative flex flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10"
              in:fly={{ y: 20, duration: 300, delay: Math.random() * 100 }}
            >
              <!-- Image -->
              <div
                class="relative aspect-[2.5/3.5] overflow-hidden bg-slate-900"
              >
                <CardImage
                  set={card.paramSet ?? 'set1'}
                  number={card.paramNumber ?? 1}
                  crop={selectedCrop}
                  alt={card.name}
                  class="h-full w-full"
                />
              </div>

              <!-- Card Content -->
              <div class="flex flex-1 flex-col gap-2 bg-slate-800 p-4">
                <div>
                  <h3
                    class="text-base leading-tight font-bold text-slate-100 transition-colors group-hover:text-purple-400"
                  >
                    {card.name}
                  </h3>
                  {#if card.version}
                    <p class="text-xs font-medium text-slate-500">
                      {card.version}
                    </p>
                  {/if}
                </div>

                <div
                  class="mt-2 line-clamp-4 text-xs leading-relaxed whitespace-pre-line text-slate-300 opacity-90"
                >
                  {card.text ?? ''}
                </div>

                <div
                  class="mt-auto flex items-center justify-between border-t border-slate-700/50 pt-4 text-xs text-slate-500"
                >
                  <span class="capitalize">{card.cardType}</span>
                  <div class="flex gap-2">
                    {#if 'strength' in card && card.strength !== undefined}
                      <span class="text-slate-300">⚔️ {card.strength}</span>
                    {/if}
                    {#if 'willpower' in card && card.willpower !== undefined}
                      <span class="text-slate-300">🛡️ {card.willpower}</span>
                    {/if}
                    {#if 'lore' in card && card.lore !== undefined}
                      <span class="text-slate-300">💎 {card.lore}</span>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
        {#if filteredCards.length === 0}
          <div class="py-20 text-center">
            <p class="text-slate-500">No cards found matching your criteria.</p>
            <button
              class="mt-4 cursor-pointer text-sm text-purple-400 hover:text-purple-300"
              onclick={() => {
								selectedInk = [];
								selectedCost = [];
								selectedType = [];
								selectedSets = [];
								searchQuery = '';
							}}
            >
              Clear all filters
            </button>
          </div>
        {/if}
      </section>
    </div>
  </main>
</div>

<style>
  /* Custom overrides if needed, mostly using Tailwind */
</style>
