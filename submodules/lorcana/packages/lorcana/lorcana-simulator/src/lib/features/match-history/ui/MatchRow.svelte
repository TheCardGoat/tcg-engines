<script lang="ts">
  import type { MatchSummary } from "../types";
  import { cn } from "$lib/utils.js";
  import { INK_COLORS, getActiveInks } from "./color-mask";
  import { getInkSymbolUrl } from "$lib/features/simulator/model/asset-urls.js";
  import Clock from "@lucide/svelte/icons/clock";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import MessageSquare from "@lucide/svelte/icons/message-square";
  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import ArrowDown from "@lucide/svelte/icons/arrow-down";

  interface Props {
    match: MatchSummary;
    expanded?: boolean;
  }

  let { match, expanded = false }: Props = $props();

  // svelte-ignore state_referenced_locally
  let isOpen = $state(expanded);

  const resultConfig = $derived(
    match.result === "win"
      ? { label: "W", class: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" }
      : match.result === "loss"
        ? { label: "L", class: "bg-red-500/20 border-red-500/40 text-red-300" }
        : { label: "D", class: "bg-slate-500/20 border-slate-500/40 text-slate-300" },
  );

  const matchTypeConfig = $derived(
    match.matchType === "ranked"
      ? { label: "Ranked", class: "bg-amber-500/15 border-amber-500/30 text-amber-400" }
      : match.matchType === "casual"
        ? { label: "Casual", class: "bg-sky-500/15 border-sky-500/30 text-sky-400" }
        : match.matchType === "testing"
          ? { label: "Test", class: "bg-violet-500/15 border-violet-500/30 text-violet-400" }
          : match.matchType === "practice_vs_bot"
            ? { label: "Bot", class: "bg-slate-500/15 border-slate-500/30 text-slate-400" }
            : match.matchType === "private"
              ? { label: "Private", class: "bg-indigo-500/15 border-indigo-500/30 text-indigo-400" }
              : null,
  );

  const mmrDelta = $derived.by(() => {
    if (match.mmrBefore === null || match.mmrAfter === null) return null;
    const delta = match.mmrAfter - match.mmrBefore;
    return Math.round(delta);
  });

  const formatLabel = $derived(
    match.formatId === "bo3"
      ? "Bo3"
      : match.formatId === "bo1"
        ? "Bo1"
        : match.formatId ?? "",
  );

  function formatDuration(seconds: number | null): string {
    if (seconds === null) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  function formatTimeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
</script>

<button
  class="group flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
  onclick={() => (isOpen = !isOpen)}
  type="button"
>
  <div class="flex shrink-0 items-center gap-2">
    <div
      class="flex size-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold {resultConfig.class}"
    >
      {resultConfig.label}
    </div>
    {#if matchTypeConfig}
      <span
        class="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide {matchTypeConfig.class}"
      >
        {matchTypeConfig.label}
      </span>
    {/if}
    {#if mmrDelta !== null && mmrDelta !== 0}
      <span
        class={cn(
          "inline-flex size-5 items-center justify-center rounded-full border",
          mmrDelta > 0
            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
            : "border-red-500/25 bg-red-500/10 text-red-400",
        )}
        role="img"
        aria-label={mmrDelta > 0 ? "MMR increased" : "MMR decreased"}
        title={mmrDelta > 0 ? "MMR increased" : "MMR decreased"}
      >
        {#if mmrDelta > 0}
          <ArrowUp class="size-3" />
        {:else}
          <ArrowDown class="size-3" />
        {/if}
      </span>
    {/if}
  </div>

  <div class="min-w-0 flex-1">
    {#if match.playerDeckName}
      <div class="text-xs text-slate-500 truncate">{match.playerDeckName}</div>
    {/if}
    <div class="flex items-center gap-1">
      {#each getActiveInks(match.opponentDeckColorMask) as ink, i}
        <img src={getInkSymbolUrl(INK_COLORS[ink].ink)} alt={INK_COLORS[ink].label} class="size-4 shrink-0 {i > 0 ? '-ml-1.5' : ''}" />
      {/each}
      <span class="truncate text-sm font-medium text-slate-200">
        {match.opponentDisplayName ?? "Opponent"}
      </span>
    </div>
    <div class="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
      {#if formatLabel}
        <span>{formatLabel}</span>
        <span class="text-slate-700">&middot;</span>
      {/if}
      {#if match.durationSeconds !== null}
        <span class="flex items-center gap-0.5">
          <Clock class="size-3" />
          {formatDuration(match.durationSeconds)}
        </span>
      {/if}
    </div>
  </div>

  <div class="flex shrink-0 items-center gap-2">
    {#if match.note}
      <MessageSquare class="size-3.5 text-slate-500" />
    {/if}
    <span class="text-xs text-slate-500">{formatTimeAgo(match.completedAt)}</span>
    <ChevronDown
      class={cn(
        "size-4 text-slate-600 transition-transform duration-200",
        isOpen && "rotate-180",
      )}
    />
  </div>
</button>

{#if isOpen}
  <div class="grid gap-2 px-3 pb-3 pt-1">
    {#if match.games.length > 0}
      <div class="flex flex-wrap gap-1.5">
        {#each match.games as game, i}
          {@const won = (game.result === "seat1_win" && game.playerSeat === 1) || (game.result === "seat2_win" && game.playerSeat === 2)}
          {@const drew = game.result === "draw"}
          <span
            class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium {won ? 'border-emerald-500/30 text-emerald-400' : drew ? 'border-slate-500/30 text-slate-400' : 'border-red-500/30 text-red-400'}"
          >
            G{game.gameNumber}
            <span class="text-[10px] font-normal opacity-70">
              {won ? "W" : drew ? "D" : "L"}
            </span>
            {#if game.onThePlaySeat !== null}
              <span class="text-[10px] font-normal opacity-50">
                {game.onThePlaySeat === game.playerSeat ? "P" : "D"}
              </span>
            {/if}
          </span>
        {/each}
      </div>
    {/if}

    {#if match.note}
      <div class="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs leading-relaxed text-slate-400">
        {match.note}
      </div>
    {/if}
  </div>
{/if}
