<script lang="ts">
  import { tick, untrack } from "svelte";
  import type { MatchSummary } from "../types";
  import { fetchMatches, type FetchMatchesParams } from "../api/player-stats-api";
  import MatchRow from "./MatchRow.svelte";
  import { Skeleton } from "$lib/design-system/primitives/skeleton";
  import { cn } from "$lib/utils.js";

  interface Props {
    initialMatches?: MatchSummary[];
    initialCursor?: string | null;
  }

  let { initialMatches = [], initialCursor = null }: Props = $props();

  type MatchTypeFilter = "all" | "ranked" | "casual" | "testing" | "practice_vs_bot" | "private";

  const MATCH_TYPE_FILTERS: { value: MatchTypeFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "ranked", label: "Ranked" },
    { value: "casual", label: "Casual" },
  ];
  const PAGE_SIZE = 10;

  let matches = $state<MatchSummary[]>(untrack(() => initialMatches));
  let nextCursor = $state<string | null>(untrack(() => initialCursor));
  let loading = $state(false);
  let loadingMore = $state(false);
  let error = $state<string | null>(null);
  let activeFilter = $state<string>("all");
  let activeFormat = $state<string | null>(null);
  let activeMatchType = $state<MatchTypeFilter>("all");
  let currentPage = $state(0);
  let listViewport: HTMLElement | undefined = $state();

  let hasMore = $derived(nextCursor !== null);
  let pageCount = $derived(Math.max(1, Math.ceil(matches.length / PAGE_SIZE)));
  let visibleStart = $derived(currentPage * PAGE_SIZE);
  let visibleEnd = $derived(Math.min(visibleStart + PAGE_SIZE, matches.length));
  let visibleMatches = $derived(matches.slice(visibleStart, visibleEnd));
  let canGoPrevious = $derived(currentPage > 0);
  let canGoNext = $derived(visibleEnd < matches.length || hasMore);
  let rangeLabel = $derived(`${visibleStart + 1}-${visibleEnd}`);

  async function loadMore(): Promise<boolean> {
    if (!hasMore || loadingMore) return false;
    loadingMore = true;
    error = null;
    try {
      const params: FetchMatchesParams = { cursor: nextCursor ?? undefined, limit: 20 };
      if (activeFilter !== "all") params.deckListId = activeFilter;
      if (activeFormat) params.formatId = activeFormat;
      if (activeMatchType !== "all") params.matchType = activeMatchType;
      const result = await fetchMatches(params);
      matches = [...matches, ...result.matches];
      nextCursor = result.nextCursor;
      return result.matches.length > 0;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load matches";
      return false;
    } finally {
      loadingMore = false;
    }
  }

  async function refresh(opts?: { filter?: string; format?: string | null; matchType?: MatchTypeFilter }): Promise<void> {
    loading = true;
    error = null;
    matches = [];
    nextCursor = null;
    currentPage = 0;
    activeFilter = opts?.filter ?? "all";
    activeFormat = opts?.format ?? null;
    activeMatchType = opts?.matchType ?? "all";
    try {
      const params: FetchMatchesParams = { limit: 20 };
      if (activeFilter !== "all") params.deckListId = activeFilter;
      if (activeFormat) params.formatId = activeFormat;
      if (activeMatchType !== "all") params.matchType = activeMatchType;
      const result = await fetchMatches(params);
      matches = result.matches;
      nextCursor = result.nextCursor;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load matches";
    } finally {
      loading = false;
    }
  }

  async function goToPage(page: number): Promise<void> {
    currentPage = Math.max(0, Math.min(page, pageCount - 1));
    await tick();
    listViewport?.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function goToPreviousPage(): Promise<void> {
    if (!canGoPrevious) return;
    await goToPage(currentPage - 1);
  }

  async function goToNextPage(): Promise<void> {
    if (!canGoNext || loadingMore) return;
    if (visibleEnd >= matches.length) {
      const loaded = await loadMore();
      if (!loaded) return;
    }
    await goToPage(currentPage + 1);
  }

  function handleFilterChange(deckListId: string): void {
    void refresh({ filter: deckListId, format: activeFormat, matchType: activeMatchType });
  }

  function handleFormatChange(formatId: string | null): void {
    void refresh({ filter: activeFilter, format: formatId, matchType: activeMatchType });
  }

  function handleMatchTypeChange(matchType: MatchTypeFilter): void {
    void refresh({ filter: activeFilter, format: activeFormat, matchType });
  }

  export async function reset(): Promise<void> {
    void refresh();
  }

  function matchRowKey(match: MatchSummary, index: number): string {
    return `${match.matchId}:${visibleStart + index}`;
  }
</script>

<div class="space-y-2">
  <div class="flex flex-wrap gap-1.5">
    {#each MATCH_TYPE_FILTERS as filter}
      <button
        class={cn(
          "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
          activeMatchType === filter.value
            ? "border-white/20 bg-white/10 text-slate-200"
            : "border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-slate-300",
        )}
        onclick={() => handleMatchTypeChange(filter.value)}
        type="button"
      >
        {filter.label}
      </button>
    {/each}
  </div>

  {#if loading}
    <div class="space-y-2">
      {#each Array(8) as _}
        <div class="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
          <Skeleton class="size-8 rounded-lg" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-32" />
            <Skeleton class="h-3 w-20" />
          </div>
          <Skeleton class="h-3 w-12" />
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-center text-sm text-red-300">
      {error}
      <button
        class="mt-1 text-sm font-medium underline underline-offset-2"
        onclick={() => void refresh()}
        type="button"
      >
        Try again
      </button>
    </div>
  {:else if matches.length === 0}
    <div class="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <div class="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
        <span class="text-2xl opacity-40">&#9876;</span>
      </div>
      <p class="text-sm text-slate-400">No matches found</p>
    </div>
  {:else}
    <div class="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015]">
      <div class="flex items-center justify-between gap-3 border-b border-white/[0.06] px-3 py-2">
        <p class="text-xs tabular-nums text-slate-500">
          Showing {rangeLabel} of {matches.length}{hasMore ? "+" : ""}
        </p>
        <div class="flex items-center gap-1.5">
          <button
            class="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            disabled={!canGoPrevious}
            onclick={() => void goToPreviousPage()}
          >
            Previous
          </button>
          <span class="min-w-12 text-center text-xs tabular-nums text-slate-500">
            {currentPage + 1}/{pageCount}{hasMore ? "+" : ""}
          </span>
          <button
            class="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            disabled={!canGoNext || loadingMore}
            onclick={() => void goToNextPage()}
          >
            {loadingMore ? "Loading" : "Next"}
          </button>
        </div>
      </div>

      <div
        bind:this={listViewport}
        class="max-h-[34rem] space-y-1.5 overflow-y-auto overscroll-contain p-2 [scrollbar-color:rgba(148,163,184,0.45)_transparent] [scrollbar-width:thin]"
      >
        {#each visibleMatches as match, i (matchRowKey(match, i))}
          <MatchRow {match} />
        {/each}
        {#if loadingMore}
          <div class="space-y-2">
            {#each Array(3) as _}
              <div class="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                <Skeleton class="size-8 rounded-lg" />
                <div class="flex-1 space-y-2">
                  <Skeleton class="h-4 w-32" />
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
