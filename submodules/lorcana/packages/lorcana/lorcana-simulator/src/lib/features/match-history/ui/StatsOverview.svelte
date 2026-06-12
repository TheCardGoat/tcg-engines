<script lang="ts">
  import type { PlayerStats } from "../types";
  import { winRateTextClass, winRateBarClass, winRateBarBgClass } from "./win-rate-color";

  interface Props {
    stats: PlayerStats;
  }

  let { stats }: Props = $props();

  const winRateColor = $derived(winRateTextClass(stats.winRate));
  const winRateBarColor = $derived(winRateBarClass(stats.winRate));
  const winRateBarBg = $derived(winRateBarBgClass(stats.winRate));
</script>

<div class="grid grid-cols-3 gap-2.5">
  <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-center">
    <p class="text-2xl font-bold tabular-nums {winRateColor}">
      {stats.winRate}<span class="text-sm">%</span>
    </p>
    <p class="mt-1 text-[11px] font-medium uppercase tracking-widest text-slate-500">Win Rate</p>
    <div class="mx-auto mt-2 h-1 w-full max-w-[5rem] overflow-hidden rounded-full {winRateBarBg}">
      <div
        class="h-full rounded-full {winRateBarColor} transition-all duration-500"
        style={`width:${Math.max(2, stats.winRate)}%`}
      ></div>
    </div>
  </div>

  <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-center">
    <p class="text-2xl font-bold tabular-nums text-slate-100">
      {stats.gamesPlayed}
    </p>
    <p class="mt-1 text-[11px] font-medium uppercase tracking-widest text-slate-500">Matches</p>
    <p class="mt-2 text-xs tabular-nums text-slate-400">
      <span class="text-emerald-400/80">{stats.gamesWon}W</span>
      <span class="mx-1 opacity-30">/</span>
      <span class="text-red-400/80">{stats.losses}L</span>
    </p>
  </div>

  <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-center">
    {#if stats.currentWinStreak >= 2}
      <p class="text-2xl font-bold tabular-nums text-amber-400">
        {stats.currentWinStreak}
      </p>
      <p class="mt-1 text-[11px] font-medium uppercase tracking-widest text-slate-500">Streak</p>
      <p class="mt-2 text-xs text-amber-400/70">
        {stats.currentWinStreak === stats.highestWinStreak
          ? "Personal Best!"
          : `Best: ${stats.highestWinStreak}`}
      </p>
    {:else if stats.currentLossStreak >= 2}
      <p class="text-2xl font-bold tabular-nums text-red-400">
        {stats.currentLossStreak}
      </p>
      <p class="mt-1 text-[11px] font-medium uppercase tracking-widest text-slate-500">Losses</p>
      <p class="mt-2 text-xs text-slate-500">
        Keep going
      </p>
    {:else}
      <p class="text-2xl font-bold tabular-nums text-slate-100">
        -
      </p>
      <p class="mt-1 text-[11px] font-medium uppercase tracking-widest text-slate-500">Streak</p>
      <p class="mt-2 text-xs text-slate-500">
        Best: {stats.highestWinStreak}
      </p>
    {/if}
  </div>
</div>
