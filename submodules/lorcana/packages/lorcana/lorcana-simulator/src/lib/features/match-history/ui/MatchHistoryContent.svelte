<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { Skeleton } from "$lib/design-system/primitives/skeleton";
  import StatsOverview from "./StatsOverview.svelte";
  import StreakBanner from "./StreakBanner.svelte";
  import MmrChart from "./MmrChart.svelte";
  import MatchList from "./MatchList.svelte";
  import ResultLine from "./ResultLine.svelte";
  import DeckRundownCard from "./DeckRundownCard.svelte";
  import PlayingStreakCard from "./PlayingStreakCard.svelte";
  import MilestonesCard from "./MilestonesCard.svelte";
  import SportsmanshipCard from "./SportsmanshipCard.svelte";
  import {
    fetchPlayerStats,
    fetchMatches,
    fetchMmrHistory,
    fetchMilestones,
    fetchPlayingStreak,
    fetchDeckRundown,
  } from "../api/player-stats-api";
  import type {
    PlayerStats,
    MatchListResponse,
    MilestonesResponse,
    MmrHistoryPoint,
    PlayingStreak,
    DeckRundownResponse,
  } from "../types";
  import {
    type DeckOption,
    getDeckOptions,
    isValidDeckMask,
  } from "../deck-rundown-aggregate";
  import { cn } from "$lib/utils.js";

  interface Props {
    initialStats?: PlayerStats | null;
    initialMmrHistory?: MmrHistoryPoint[];
    initialPlayingStreak?: PlayingStreak | null;
    initialMilestones?: MilestonesResponse | null;
    initialMatchList?: { matches: MatchListResponse["matches"]; nextCursor: string | null };
    initialDeckRundown?: DeckRundownResponse | null;
  }

  let {
    initialStats,
    initialMmrHistory,
    initialPlayingStreak,
    initialMilestones,
    initialMatchList,
    initialDeckRundown,
  }: Props = $props();

  const hasServerData = untrack(() => initialStats !== undefined);

  const EYEBROW_CLASS =
    "text-muted-foreground text-xs font-semibold uppercase tracking-[0.24em]";

  let stats = $state<PlayerStats | null>(untrack(() => initialStats ?? null));
  let mmrHistory = $state<MmrHistoryPoint[]>(untrack(() => initialMmrHistory ?? []));
  let playingStreak = $state<PlayingStreak | null>(untrack(() => initialPlayingStreak ?? null));
  let milestones = $state<MilestonesResponse | null>(untrack(() => initialMilestones ?? null));
  let matchList = $state<{ matches: MatchListResponse["matches"]; nextCursor: string | null }>(
    untrack(() => initialMatchList ?? { matches: [], nextCursor: null }),
  );
  let loading = $state(!hasServerData);
  let error = $state<string | null>(null);
  let partialWarning = $state<string | null>(null);
  let deckRundown = $state<DeckRundownResponse | null>(untrack(() => initialDeckRundown ?? null));
  let deckRundownLoading = $state(false);
  let deckRundownError = $state<string | null>(null);

  let matchListRef = $state<{ reset: () => Promise<void> } | null>(null);

  async function loadDeckRundownForOption(opt: DeckOption): Promise<void> {
    if (!isValidDeckMask(opt.mask)) return;
    deckRundownLoading = true;
    deckRundownError = null;
    try {
      deckRundown = await fetchDeckRundown({
        deckColorMask: opt.mask,
        deckListId: opt.deckListId ?? undefined,
      });
    } catch (err) {
      deckRundownError = err instanceof Error ? err.message : "Failed to load deck rundown";
      if (import.meta.env.DEV) {
        console.error("[match-history] fetchDeckRundown failed:", err);
      }
    } finally {
      deckRundownLoading = false;
    }
  }

  async function loadDeckRundown(matches: MatchListResponse["matches"]): Promise<void> {
    const opts = getDeckOptions(matches);
    const primaryOpt = opts.length > 0 && isValidDeckMask(opts[0].mask) ? opts[0] : null;
    if (primaryOpt === null) {
      deckRundownLoading = false;
      return;
    }
    await loadDeckRundownForOption(primaryOpt);
  }

  async function loadAll(): Promise<void> {
    loading = true;
    error = null;
    try {
      const [statsResult, mmrResult, streakResult, milestonesResult, matchesResult] =
        await Promise.allSettled([
          fetchPlayerStats(),
          fetchMmrHistory(),
          fetchPlayingStreak(),
          fetchMilestones(),
          fetchMatches({ limit: 20 }),
        ]);

      if (import.meta.env.DEV) {
        console.debug("[match-history] loadAll settled:", {
          stats: statsResult.status,
          mmr: mmrResult.status,
          streak: streakResult.status,
          milestones: milestonesResult.status,
          matches: matchesResult.status,
        });
      }

      if (statsResult.status === "fulfilled") stats = statsResult.value;
      if (mmrResult.status === "fulfilled") mmrHistory = mmrResult.value;
      if (streakResult.status === "fulfilled") playingStreak = streakResult.value;
      if (milestonesResult.status === "fulfilled") milestones = milestonesResult.value;
      if (matchesResult.status === "fulfilled") {
        matchList = { matches: matchesResult.value.matches, nextCursor: matchesResult.value.nextCursor };
        if (import.meta.env.DEV) {
          console.debug("[match-history] loaded %d matches, nextCursor=%s", matchesResult.value.matches.length, matchesResult.value.nextCursor);
        }
        void loadDeckRundown(matchesResult.value.matches);
      }

      if (matchesResult.status === "rejected") {
        console.error("[match-history] fetchMatches rejected:", matchesResult.reason);
      }

      const results: { key: string; result: PromiseSettledResult<unknown> }[] = [
        { key: "stats", result: statsResult },
        { key: "mmr history", result: mmrResult },
        { key: "playing streak", result: streakResult },
        { key: "milestones", result: milestonesResult },
        { key: "matches", result: matchesResult },
      ];

      const errors = results.filter((r): r is { key: string; result: PromiseRejectedResult } => r.result.status === "rejected");

      if (statsResult.status === "fulfilled" && statsResult.value.gamesPlayed > 0 && errors.length > 0) {
        partialWarning = `Some data could not be loaded: ${errors.map((e) => e.key).join(", ")}`;
      } else if (errors.length === results.length) {
        error = errors[0].result.reason instanceof Error ? errors[0].result.reason.message : "Failed to load data";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load match history";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    if (!hasServerData) {
      void loadAll();
    }
  });
</script>

<div class="space-y-3 sm:space-y-4">
  {#if loading}
    <div class="space-y-4">
      <div class="grid grid-cols-3 gap-2.5">
        {#each Array(3) as _}
          <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
            <Skeleton class="mx-auto h-7 w-16" />
            <Skeleton class="mx-auto mt-2 h-3 w-14" />
          </div>
        {/each}
      </div>
      <Skeleton class="h-[140px] w-full rounded-xl" />
      <Skeleton class="h-[200px] w-full rounded-xl" />
    </div>
  {:else if error && !stats}
    <div class="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <div class="flex size-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/5">
        <span class="text-xl">!</span>
      </div>
      <p class="text-sm text-red-300">{error}</p>
      <button
        class="text-sm font-medium text-sky-400 underline underline-offset-2 hover:text-sky-300"
        onclick={() => void loadAll()}
        type="button"
      >
        Try again
      </button>
    </div>
  {:else if stats && stats.gamesPlayed === 0 && matchList.matches.length === 0}
    <div class="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <div class="flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <span class="text-3xl opacity-30">&#9876;</span>
      </div>
      <div>
        <p class="text-lg font-semibold text-slate-200">No matches yet</p>
        <p class="mt-1 text-sm text-slate-400">Play your first match to see your history here</p>
      </div>
    </div>
  {:else if stats}
    {#if partialWarning}
      <div class="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
        <span class="text-xs text-amber-300">{partialWarning}</span>
      </div>
    {/if}

    <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] xl:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
      <div class="space-y-3 sm:space-y-4">
        <StatsOverview {stats} />

        {#if stats.currentWinStreak >= 2}
          <StreakBanner {stats} />
        {/if}

        <DeckRundownCard
          matches={matchList.matches}
          rundown={deckRundown}
          rundownLoading={deckRundownLoading}
          rundownError={deckRundownError}
          onDeckChange={(opt) => void loadDeckRundownForOption(opt)}
        />

        <div>
          <p class={cn(EYEBROW_CLASS, "mb-2.5 px-1")}>Match History</p>
          <MatchList
            bind:this={matchListRef}
            initialMatches={matchList.matches}
            initialCursor={matchList.nextCursor}
          />
        </div>
      </div>

      <aside class="space-y-3 sm:space-y-4 lg:sticky lg:top-0">
        {#if stats.recentResults.length > 0}
          <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <p class={cn(EYEBROW_CLASS, "mb-2")}>Recent Results</p>
            <ResultLine {stats} />
          </div>
        {/if}

        <MmrChart
          data={mmrHistory}
          mmr={stats.mmr}
          highestMmr={stats.highestMmr}
          bracket={stats.bracket}
        />

        {#if playingStreak}
          <PlayingStreakCard streak={playingStreak} />
        {/if}

        <MilestonesCard {milestones} />

        <SportsmanshipCard {stats} />
      </aside>
    </div>

    {#if import.meta.env.DEV}
      <details class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <summary class="cursor-pointer text-xs font-semibold uppercase tracking-widest text-slate-500">
          Debug Data
        </summary>
        <div class="mt-3 space-y-4">
          <div>
            <p class="mb-1 text-[11px] font-medium uppercase tracking-widest text-slate-600">PlayerStats</p>
            <pre class="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-black/30 p-3 text-[11px] leading-relaxed text-slate-300">{JSON.stringify(stats, null, 2)}</pre>
          </div>
          <div>
            <p class="mb-1 text-[11px] font-medium uppercase tracking-widest text-slate-600">MMR History ({mmrHistory.length} points)</p>
            <pre class="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-black/30 p-3 text-[11px] leading-relaxed text-slate-300">{JSON.stringify(mmrHistory.slice(-5), null, 2)}</pre>
          </div>
          <div>
            <p class="mb-1 text-[11px] font-medium uppercase tracking-widest text-slate-600">Playing Streak</p>
            <pre class="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-black/30 p-3 text-[11px] leading-relaxed text-slate-300">{JSON.stringify(playingStreak, null, 2)}</pre>
          </div>
          <div>
            <p class="mb-1 text-[11px] font-medium uppercase tracking-widest text-slate-600">Match List ({matchList.matches.length} loaded, cursor: {matchList.nextCursor ?? "none"})</p>
            <pre class="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-black/30 p-3 text-[11px] leading-relaxed text-slate-300">{JSON.stringify(matchList.matches.slice(0, 3), null, 2)}</pre>
          </div>
          <div>
            <p class="mb-1 text-[11px] font-medium uppercase tracking-widest text-slate-600">Deck Rundown</p>
            <pre class="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-black/30 p-3 text-[11px] leading-relaxed text-slate-300">{JSON.stringify(deckRundown, null, 2)}</pre>
          </div>
        </div>
      </details>
    {/if}
  {/if}
</div>
