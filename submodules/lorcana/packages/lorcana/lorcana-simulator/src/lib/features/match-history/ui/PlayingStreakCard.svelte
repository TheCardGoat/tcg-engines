<script lang="ts">
  import type { PlayingStreak } from "../types";
  import Calendar from "@lucide/svelte/icons/calendar";
  import Flame from "@lucide/svelte/icons/flame";
  import Zap from "@lucide/svelte/icons/zap";
  import { cn } from "$lib/utils.js";

  interface Props {
    streak: PlayingStreak;
  }

  let { streak }: Props = $props();

  const isActive = $derived(streak.currentStreak >= 1);
  const hasMultiplier = $derived(streak.streakMultiplier > 1);
  const dayLabels = $derived(["S", "M", "T", "W", "T", "F", "S"]);

  const recentDays = $derived.by(() => {
    const now = new Date();
    const result: { day: string; active: boolean; isToday: boolean }[] = [];
    const todayStr = now.toISOString().slice(0, 10);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayIndex = d.getDay();
      const dateStr = d.toISOString().slice(0, 10);
      result.push({
        day: dayLabels[dayIndex],
        active: streak.recentActiveDates.includes(dateStr),
        isToday: i === 0,
      });
    }
    return result;
  });
</script>

<div class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <Calendar class="size-4 text-slate-500" />
      <span class="text-xs font-medium uppercase tracking-widest text-slate-500">
        {#if isActive}
          <span class="text-amber-400">
            <Flame class="mb-px mr-1 inline size-3" />
            {streak.currentStreak} day{streak.currentStreak > 1 ? "s" : ""}
          </span>
        {:else}
          Playing Streak
        {/if}
      </span>
    </div>
    <div class="flex items-center gap-2">
      {#if hasMultiplier}
        <span
          class="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400"
        >
          <Zap class="size-2.5" />
          {streak.streakMultiplier}x Bonus
        </span>
      {/if}
      {#if streak.longestStreak > 0}
        <span class="text-xs text-slate-500">Best: {streak.longestStreak}</span>
      {/if}
    </div>
  </div>

  <div class="mt-3 flex justify-between gap-1">
    {#each recentDays as day}
      <div class="flex flex-col items-center gap-1">
        <span
          class={cn(
            "text-[10px] font-medium",
            day.isToday ? "text-slate-300" : "text-slate-500",
          )}
        >
          {day.day}
        </span>
        <span
          class={cn(
            "size-2.5 rounded-full transition-colors",
            day.active ? "bg-amber-400" : day.isToday ? "bg-white/10" : "bg-slate-700",
          )}
        ></span>
      </div>
    {/each}
  </div>

  {#if streak.nextTier && isActive}
    <div class="mt-2 text-[10px] text-slate-500">
      {streak.nextTier.days - streak.currentStreak} more day{streak.nextTier.days - streak.currentStreak !== 1 ? "s" : ""} for {streak.nextTier.multiplier}x bonus
    </div>
  {/if}
</div>
