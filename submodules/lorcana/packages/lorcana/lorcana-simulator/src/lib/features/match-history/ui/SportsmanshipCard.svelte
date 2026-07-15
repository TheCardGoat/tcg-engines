<script lang="ts">
  import type { PlayerStats } from "../types";
  import Shield from "@lucide/svelte/icons/shield";

  interface Props {
    stats: PlayerStats;
  }

  let { stats }: Props = $props();

  const tierConfig: Record<string, { label: string; class: string }> = {
    friendly: { label: "Friendly", class: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" },
    sportsman: { label: "Sportsman", class: "bg-sky-500/15 border-sky-500/30 text-sky-400" },
    champion: { label: "Champion", class: "bg-amber-500/15 border-amber-500/30 text-amber-400" },
    legend: { label: "Legend", class: "bg-violet-500/15 border-violet-500/30 text-violet-400" },
  };

  const tier = $derived(stats.sportsmanshipTier ? (tierConfig[stats.sportsmanshipTier] ?? null) : null);

  const EYEBROW_CLASS =
    "text-muted-foreground text-xs font-semibold uppercase tracking-[0.24em]";
</script>

<div class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
  <div class="mb-3 flex items-center gap-2">
    <Shield class="size-4 text-slate-500" />
    <p class={EYEBROW_CLASS}>Sportsmanship</p>
  </div>

  <div class="flex items-center gap-3">
    {#if tier}
      <span
        class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide {tier.class}"
      >
        {tier.label}
      </span>
    {:else}
      <span class="inline-flex items-center rounded-md border border-white/[0.06] px-2 py-0.5 text-xs font-medium text-slate-500">
        --
      </span>
    {/if}

    <div class="flex gap-3 text-xs text-slate-500">
      <span>
        <span class="tabular-nums text-slate-300">{stats.takebacksGranted}</span> granted
      </span>
      <span>
        <span class="tabular-nums text-slate-300">{stats.takebacksReceived}</span> received
      </span>
    </div>
  </div>
</div>
