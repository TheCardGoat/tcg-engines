<script lang="ts">
  import { goto } from "$app/navigation";
  import { INK_COLORS, getActiveInks, getColorMaskLabel } from "./color-mask";
  import { winRateTextClass } from "./win-rate-color";
  import { getInkSymbolUrl } from "$lib/features/simulator/model/asset-urls.js";
  import { trackEvent } from "$lib/analytics/analytics";
  import type { MatchSummary } from "../types";
  import type { DeckRundownResponse, DeckMatchupRow } from "../types";
  import {
    type DeckOption,
    type SortMode,
    aggregateForDeck,
    computeTrend,
    getDeckOptions,
    isValidDeckMask,
  } from "../deck-rundown-aggregate";

  interface Props {
    matches: MatchSummary[];
    rundown: DeckRundownResponse | null;
    rundownLoading: boolean;
    rundownError: string | null;
    onDeckChange?: (opt: DeckOption) => void;
  }

  let { matches, rundown, rundownLoading, rundownError, onDeckChange }: Props = $props();

  const EM_DASH = "\u2014";
  const TREND_WINDOW = 20;

  let sortMode = $state<SortMode>("contribution");
  let userDeckKey = $state<string | null>(null);

  const deckOptions = $derived(getDeckOptions(matches));

  function deckOptionKey(opt: DeckOption): string {
    return `${opt.deckListId ?? "mask-only"}:${opt.mask}`;
  }

  function deckLabel(opt: DeckOption): string {
    if (opt.label) return opt.label;
    return getColorMaskLabel(opt.mask);
  }

  const selectedOption = $derived.by(() => {
    const opts = deckOptions;
    if (opts.length === 0) return null;
    if (userDeckKey !== null) {
      const selected = opts.find((o) => deckOptionKey(o) === userDeckKey);
      if (selected) return selected;
    }
    return opts[0];
  });

  const selectedDeckMask = $derived(selectedOption?.mask ?? null);

  const worstMatchup = $derived.by((): DeckMatchupRow | null => {
    const sorted = [...rows].filter((r) => r.matchCount >= 3 && r.matchWinRate !== null);
    if (sorted.length === 0) return null;
    sorted.sort((a, b) => (a.matchWinRate ?? 100) - (b.matchWinRate ?? 100));
    return sorted[0];
  });

  function handleDeckChange(e: Event): void {
    const v = (e.currentTarget as HTMLSelectElement).value;
    userDeckKey = v === "" ? null : v;
    const opt = deckOptions.find((o) => deckOptionKey(o) === v);
    if (opt) {
      trackEvent("deck_rundown_deck_selected", { deck_name: opt.label || getColorMaskLabel(opt.mask) });
      onDeckChange?.(opt);
    }
  }

  function handleSortChange(mode: SortMode): void {
    sortMode = mode;
    trackEvent("deck_rundown_sort_changed", { sort_mode: mode });
  }

  $effect(() => {
    if (rows.length > 0) {
      trackEvent("deck_rundown_view", { deck_name: selectedOption?.label ?? "unknown" });
    }
  });

  const clientData = $derived.by(() => {
    if (rundown) return null;
    const mask = selectedDeckMask;
    if (mask === null || !isValidDeckMask(mask)) return null;
    const relevant = matches.filter(
      (m) => m.playerDeckColorMask !== null && m.playerDeckColorMask === mask,
    );
    if (relevant.length === 0) return null;
    return aggregateForDeck(mask, relevant, sortMode);
  });

  const globalWinRate = $derived.by(() => {
    const total = rundown ? rundown.globalMatchTotal : clientData?.global.matchTotal ?? 0;
    const wins = rundown ? rundown.globalMatchWins : clientData?.global.matchWins ?? 0;
    if (total === 0) return null;
    return (wins / total) * 100;
  });

  const globalMatchWins = $derived(rundown ? rundown.globalMatchWins : clientData?.global.matchWins ?? 0);
  const globalMatchTotal = $derived(rundown ? rundown.globalMatchTotal : clientData?.global.matchTotal ?? 0);

  const onPlaySummaryRate = $derived.by(() => {
    const onPlayN = rundown ? rundown.globalOnPlayN : clientData?.global.onPlayN ?? 0;
    const onPlayWins = rundown ? rundown.globalOnPlayWins : clientData?.global.onPlayWins ?? 0;
    if (onPlayN === 0) return null;
    return (onPlayWins / onPlayN) * 100;
  });

  const trend = $derived.by(() => {
    const mask = selectedDeckMask;
    if (mask === null) return null;
    return computeTrend(matches, mask, TREND_WINDOW);
  });

  const rows = $derived.by((): DeckMatchupRow[] => {
    if (rundown) {
      return sortServerRows(rundown.matchups, sortMode);
    }
    if (clientData) {
      return clientData.rows.map((r) => ({
        opponentDeckColorMask: r.opponentMask,
        matchCount: r.matchCount,
        matchWins: r.matchWins,
        matchWinRate: r.matchWinRate,
        gamesTotal: r.gamesTotal,
        otpPlayed: r.otpPlayed,
        otpWins: r.otpWins,
        otpRate: r.otpRate,
        otdPlayed: r.otdPlayed,
        otdWins: r.otdWins,
        otdRate: r.otdRate,
        isMirror: r.isMirror,
        contribution: r.contribution,
      }));
    }
    return [];
  });

  function sortServerRows(serverRows: DeckMatchupRow[], mode: SortMode): DeckMatchupRow[] {
    return [...serverRows].sort((a, b) => {
      if (mode === "contribution") {
        if (b.contribution !== a.contribution) return b.contribution - a.contribution;
      } else {
        const ar = a.matchWinRate ?? -1;
        const br = b.matchWinRate ?? -1;
        if (br !== ar) return br - ar;
      }
      const la = rowLabel(a).toLowerCase();
      const lb = rowLabel(b).toLowerCase();
      if (la !== lb) return la.localeCompare(lb);
      return String(a.opponentDeckColorMask ?? "unknown").localeCompare(String(b.opponentDeckColorMask ?? "unknown"));
    });
  }

  function matchupRowKey(row: DeckMatchupRow, index: number): string {
    return [
      row.opponentDeckColorMask ?? "unknown",
      row.matchCount,
      row.matchWins,
      row.gamesTotal,
      row.otpPlayed,
      row.otdPlayed,
      index,
    ].join(":");
  }

  function rowLabel(row: DeckMatchupRow): string {
    if (row.opponentDeckColorMask === null) return "Unknown";
    return getColorMaskLabel(row.opponentDeckColorMask);
  }

  function formatPct(value: number | null): string {
    if (value === null) return EM_DASH;
    return `${value.toFixed(1)}%`;
  }

  function pctCellClass(value: number | null): string {
    if (value === null) return "text-slate-500";
    return winRateTextClass(value);
  }

  function trendIcon(dir: "up" | "down" | "stable"): string {
    return dir === "up" ? "▲" : dir === "down" ? "▼" : "●";
  }

  function trendClass(dir: "up" | "down" | "stable"): string {
    if (dir === "up") return "text-emerald-400";
    if (dir === "down") return "text-red-400";
    return "text-slate-500";
  }

  const EYEBROW_CLASS =
    "text-muted-foreground text-xs font-semibold uppercase tracking-[0.24em]";
</script>

<div class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
  <div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <p class={EYEBROW_CLASS}>Deck rundown</p>
    {#if deckOptions.length > 1}
      <label class="flex items-center gap-2 text-xs text-slate-400">
        <span class="shrink-0">Your deck</span>
        <select
          class="max-w-[260px] rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
          value={selectedOption ? deckOptionKey(selectedOption) : ""}
          onchange={handleDeckChange}
        >
          {#each deckOptions as opt (deckOptionKey(opt))}
            <option value={deckOptionKey(opt)}>
              {deckLabel(opt)} ({opt.matchCount} matches)
            </option>
          {/each}
        </select>
      </label>
    {/if}
  </div>

  {#if deckOptions.length === 0}
    <p class="py-6 text-center text-sm text-slate-500">
      Not enough recorded deck data in recent matches to analyze.
    </p>
  {:else if selectedDeckMask === null || (clientData === null && rundown === null && !rundownLoading)}
    <p class="py-6 text-center text-sm text-slate-500">No data for this deck.</p>
  {:else if rundownLoading}
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <div class="h-4 w-24 animate-pulse rounded bg-white/[0.06]"></div>
        <div class="h-6 w-16 animate-pulse rounded bg-white/[0.06]"></div>
      </div>
      <div class="h-3 w-40 animate-pulse rounded bg-white/[0.04]"></div>
      {#each Array(4) as _}
        <div class="flex items-center justify-between py-2">
          <div class="h-4 w-28 animate-pulse rounded bg-white/[0.04]"></div>
          <div class="h-4 w-12 animate-pulse rounded bg-white/[0.04]"></div>
        </div>
      {/each}
    </div>
  {:else}
    {@const mask = selectedDeckMask}

    <div class="mb-4 flex flex-col gap-3 border-b border-white/[0.06] pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2">
        {#if mask !== null}
          {#each getActiveInks(mask) as ink, i (ink)}
            <img src={getInkSymbolUrl(INK_COLORS[ink].ink)} alt={INK_COLORS[ink].label} class="size-4 shrink-0 {i > 0 ? '-ml-1.5' : ''}" />
          {/each}
          <span class="text-sm font-semibold text-slate-100">
            {selectedOption?.label ?? getColorMaskLabel(mask)}
          </span>
        {/if}
      </div>
      <div class="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
        <div class="flex items-baseline gap-1.5">
          <span class="text-xl font-bold tabular-nums {pctCellClass(globalWinRate)}">
            {formatPct(globalWinRate)}
          </span>
          <span class="text-slate-500">
            {globalMatchWins}W {globalMatchTotal - globalMatchWins}L
          </span>
        </div>
        {#if trend}
          <span class="inline-flex items-center gap-0.5 text-xs font-medium tabular-nums {trendClass(trend.direction)}">
            {trendIcon(trend.direction)}{Math.abs(trend.delta).toFixed(1)}
          </span>
        {/if}
      </div>
    </div>

    <div class="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-white/[0.06] pb-3 text-xs text-slate-500">
      <div>
        <span>On play</span>
        <span class="ml-1.5 font-medium tabular-nums {pctCellClass(onPlaySummaryRate)}">
          {formatPct(onPlaySummaryRate)}
        </span>
        {#if (rundown ? rundown.globalOnPlayN : clientData?.global.onPlayN ?? 0) > 0}
          <span class="ml-1 text-slate-600">
            ({rundown ? rundown.globalOnPlayN : clientData?.global.onPlayN} games)
          </span>
        {/if}
      </div>
      <div>
        <span>Matches</span>
        <span class="ml-1.5 font-medium tabular-nums text-slate-300">
          {globalMatchTotal}
        </span>
      </div>
    </div>

    <div class="mb-2 flex flex-wrap items-center gap-2">
      <span class="text-xs text-slate-500">Sort by</span>
      <div class="inline-flex overflow-hidden rounded-lg border border-white/10">
        <button
          class="border-r border-white/10 px-2.5 py-1 text-xs font-medium transition-colors last:border-r-0 {sortMode === 'contribution'
            ? 'bg-sky-600/30 text-sky-100'
            : 'bg-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'}"
          type="button"
          onclick={() => handleSortChange("contribution")}
        >
          Contribution
        </button>
        <button
          class="px-2.5 py-1 text-xs font-medium transition-colors {sortMode === 'winRate'
            ? 'bg-sky-600/30 text-sky-100'
            : 'bg-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'}"
          type="button"
          onclick={() => handleSortChange("winRate")}
        >
          Win rate
        </button>
      </div>
    </div>

    {#if rundownError}
      <p class="mb-2 text-xs text-red-400/80">{rundownError}</p>
    {/if}

    <div class="-mx-1 overflow-x-auto">
      <table class="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr class="border-b border-white/[0.06] text-[10px] uppercase tracking-wide text-slate-500">
            <th class="bg-transparent py-2 pr-3 text-left font-medium">Opponent</th>
            <th class="bg-transparent py-2 pl-2 text-right font-medium">Win rate</th>
            <th class="bg-transparent py-2 pl-2 text-right font-medium">OTP</th>
            <th class="bg-transparent py-2 pl-2 text-right font-medium">OTD</th>
            <th class="bg-transparent py-2 pl-2 text-right font-medium">Games</th>
          </tr>
        </thead>
        <tbody>
          {#each rows as row, i (matchupRowKey(row, i))}
            {@const rowOpacity = row.matchCount < 3 ? "opacity-50" : ""}
            <tr class="border-b border-white/[0.04] last:border-b-0 {rowOpacity}">
              <td class="max-w-[200px] py-2 pr-3 align-middle">
                <div class="flex flex-wrap items-center gap-1.5">
                  {#if row.opponentDeckColorMask !== null}
                    {#each getActiveInks(row.opponentDeckColorMask) as ink, i (ink)}
                      <img src={getInkSymbolUrl(INK_COLORS[ink].ink)} alt={INK_COLORS[ink].label} class="size-3.5 shrink-0 {i > 0 ? '-ml-1.5' : ''}" />
                    {/each}
                  {:else}
                    <span class="text-slate-600" title="Unknown colors">?</span>
                  {/if}
                  <span class="truncate text-sm text-slate-200">{rowLabel(row)}</span>
                  {#if row.isMirror}
                    <span
                      class="inline-flex shrink-0 rounded border border-amber-500/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-300/90"
                      >Mirror</span
                    >
                  {/if}
                </div>
              </td>
              <td class="py-2 pl-2 text-right align-middle text-sm font-medium tabular-nums {pctCellClass(row.matchWinRate)}">
                {formatPct(row.matchWinRate)}
              </td>
              <td class="py-2 pl-2 text-right align-middle text-sm tabular-nums {pctCellClass(row.otpRate)}">
                {row.otpPlayed === 0 ? EM_DASH : formatPct(row.otpRate)}
              </td>
              <td class="py-2 pl-2 text-right align-middle text-sm tabular-nums {pctCellClass(row.otdRate)}">
                {row.otdPlayed === 0 ? EM_DASH : formatPct(row.otdRate)}
              </td>
              <td class="py-2 pl-2 text-right align-middle tabular-nums text-sm text-slate-300">
                {row.gamesTotal}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if worstMatchup && worstMatchup.matchWinRate !== null && worstMatchup.matchWinRate < 45}
      <div class="mt-3 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
        <div class="text-xs text-slate-400">
          <span class="text-slate-300">Toughest matchup:</span> {rowLabel(worstMatchup)} ({formatPct(worstMatchup.matchWinRate)})
        </div>
        <button
          class="rounded-md bg-sky-600/20 px-3 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-600/30"
          type="button"
          onclick={() => goto("/matchmaking")}
        >
          Queue
        </button>
      </div>
    {/if}

    {#if !rundown}
      <p class="mt-3 text-[10px] text-slate-600">Based on your loaded match history</p>
    {/if}
  {/if}
</div>
