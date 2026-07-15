<script lang="ts">
  import type { PlayerStats } from "../types";
  import { cn } from "$lib/utils.js";
  import Flame from "@lucide/svelte/icons/flame";
  import Trophy from "@lucide/svelte/icons/trophy";

  interface Props {
    stats: PlayerStats;
  }

  let { stats }: Props = $props();

  const isActive = $derived(stats.currentWinStreak >= 2);

  const isPersonalBest = $derived(stats.currentWinStreak >= 2 && stats.currentWinStreak >= stats.highestWinStreak);
</script>

{#if isActive}
  <div
    class={cn(
      "relative overflow-hidden rounded-xl border px-4 py-3",
      isPersonalBest
        ? "border-amber-400/40 bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60"
        : "border-amber-400/20 bg-amber-950/30",
    )}
  >
    <div class="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none"></div>
    <div class="relative flex items-center gap-3">
      <div
        class={cn(
          "flex size-10 items-center justify-center rounded-lg",
          isPersonalBest ? "bg-amber-400/20" : "bg-amber-400/10",
        )}
      >
        {#if isPersonalBest}
          <Trophy class="size-5 text-amber-300" />
        {:else}
          <Flame class="size-5 text-amber-300" />
        {/if}
      </div>
      <div>
        <p class="text-sm font-bold text-amber-100">
          {stats.currentWinStreak} Win Streak!
        </p>
        {#if isPersonalBest}
          <p class="text-xs text-amber-300/80">Personal Best!</p>
        {:else}
          <p class="text-xs text-amber-200/60">Best: {stats.highestWinStreak}</p>
        {/if}
      </div>
    </div>
  </div>
{/if}
