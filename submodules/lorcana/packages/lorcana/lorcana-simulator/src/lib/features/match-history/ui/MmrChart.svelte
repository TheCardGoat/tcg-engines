<script lang="ts">
  import type { MmrHistoryPoint } from "../types";
  import { Badge } from "$lib/design-system/primitives/badge";
  import { Skeleton } from "$lib/design-system/primitives/skeleton";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { AreaChart } from "layerchart";
  import { cn } from "$lib/utils.js";

  interface Props {
    data: MmrHistoryPoint[];
    mmr: number | null;
    highestMmr: number | null;
    bracket: string | null;
    loading?: boolean;
  }

  let { data, mmr, highestMmr, bracket, loading = false }: Props = $props();

  const chartConfig = {
    mmr: {
      label: "MMR",
      color: "var(--chart-1)",
    },
  } satisfies Chart.ChartConfig;

  const chartData = $derived(
    data.map((p) => ({
      date: p.completedAt.slice(0, 10),
      mmr: p.mmr,
    })),
  );

  type TrendDir = "up" | "down" | "stable";

  const trendDirection = $derived.by<TrendDir>(() => {
    if (data.length < 2) return "stable";
    const recent = data[data.length - 1].mmr;
    const previous = data[data.length - 2].mmr;
    if (recent > previous + 5) return "up";
    if (recent < previous - 5) return "down";
    return "stable";
  });

  const trendLabel: Record<TrendDir, string> = {
    up: "Rising",
    down: "Falling",
    stable: "Stable",
  };

  const trendArrow: Record<TrendDir, string> = {
    up: "▲",
    down: "▼",
    stable: "—",
  };

  const trendColorClass: Record<TrendDir, string> = {
    up: "text-emerald-400",
    down: "text-red-400",
    stable: "text-slate-500",
  };
</script>

<div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
  <div class="mb-3 flex items-center justify-between">
    <div>
      <p class="text-xs font-medium uppercase tracking-widest text-slate-500">Rating</p>
      <div class="mt-1 flex items-baseline gap-2">
        {#if loading}
          <Skeleton class="h-7 w-16" />
        {:else if mmr !== null}
          <span class="text-xl font-bold tabular-nums text-slate-100">{Math.round(mmr)}</span>
          {#if bracket}
            <Badge variant="outline" class="text-[10px]">
              {bracket.charAt(0).toUpperCase() + bracket.slice(1)}
            </Badge>
          {/if}
          {#if highestMmr !== null && highestMmr > mmr}
            <span class="text-xs text-slate-500">Peak: {Math.round(highestMmr)}</span>
          {/if}
        {:else}
          <span class="text-sm text-slate-500">-</span>
        {/if}
      </div>
    </div>
    {#if !loading && data.length >= 2}
      <span class={cn("text-xs font-medium", trendColorClass[trendDirection])}>
        {trendArrow[trendDirection]} {trendLabel[trendDirection]}
      </span>
    {/if}
  </div>

  {#if loading}
    <Skeleton class="h-[100px] w-full rounded-lg" />
  {:else if chartData.length >= 2}
    <Chart.Container config={chartConfig} class="h-[100px] w-full min-w-0">
      <AreaChart
        data={chartData}
        x="date"
        y="mmr"
        padding={{ left: 2, right: 2, top: 4, bottom: 4 }}
        tooltipContext={false}
      />
    </Chart.Container>
  {:else}
    <div class="flex h-[60px] items-center justify-center text-xs text-slate-600">
      Play more matches to see your rating history
    </div>
  {/if}
</div>
