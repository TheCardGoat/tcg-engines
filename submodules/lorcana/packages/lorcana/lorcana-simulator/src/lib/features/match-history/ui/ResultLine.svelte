<script lang="ts">
  import type { PlayerStats } from "../types";
  import { cn } from "$lib/utils.js";

  interface Props {
    stats: PlayerStats;
  }

  let { stats }: Props = $props();

  function resultClass(result: string): string {
    if (result === "win") return "bg-emerald-500/25 text-emerald-400";
    if (result === "loss") return "bg-red-500/25 text-red-400";
    return "bg-slate-500/20 text-slate-400";
  }

  function resultTitle(result: string): string {
    if (result === "win") return "Win";
    if (result === "loss") return "Loss";
    return "Draw";
  }

  function resultLabel(result: string): string {
    if (result === "win") return "W";
    if (result === "loss") return "L";
    return "D";
  }
</script>

<div class="flex gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  {#each stats.recentResults as result, i}
    <span
      class={cn(
        "flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold",
        resultClass(result),
      )}
      title={resultTitle(result)}
    >
      {resultLabel(result)}
    </span>
  {/each}
</div>
