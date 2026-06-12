<script lang="ts">
  import type { MilestonesResponse } from "../types";
  import { cn } from "$lib/utils.js";
  import Trophy from "@lucide/svelte/icons/trophy";
  import Flame from "@lucide/svelte/icons/flame";
  import Target from "@lucide/svelte/icons/target";
  import Shield from "@lucide/svelte/icons/shield";
  import Zap from "@lucide/svelte/icons/zap";
  import Crown from "@lucide/svelte/icons/crown";
  import Swords from "@lucide/svelte/icons/swords";
  import Clock from "@lucide/svelte/icons/clock";

  interface Props {
    milestones: MilestonesResponse | null;
  }

  let { milestones }: Props = $props();

  // Presentation-only mapping. Server owns the criteria, ordering, and
  // unlock state; client owns label/description/icon for each known id.
  // Unknown ids (added server-side ahead of a client deploy) fall back to
  // a generic trophy.
  type Presentation = {
    label: string;
    description: string;
    icon: typeof Trophy;
  };

  const PRESENTATION: Record<string, Presentation> = {
    first_blood: { label: "First Blood", description: "Play your first game", icon: Zap },
    ten_games: { label: "Getting Started", description: "Play 10 games", icon: Target },
    century: { label: "Century", description: "Play 100 games", icon: Shield },
    on_fire: { label: "On Fire", description: "Win 5 games in a row", icon: Flame },
    inferno: { label: "Inferno", description: "Win 10 games in a row", icon: Flame },
    consistent: { label: "Consistent", description: "55%+ win rate (50+ games)", icon: Target },
    veteran: { label: "Veteran", description: "Play 500 games", icon: Crown },
    dedicated: { label: "Dedicated", description: "Play a game today", icon: Clock },
    gladiator: { label: "Gladiator", description: "Win 100 games", icon: Swords },
    active_week: { label: "Active Week", description: "Play 10 games this week", icon: Clock },
  };

  const FALLBACK: Presentation = {
    label: "Achievement",
    description: "",
    icon: Trophy,
  };

  const list = $derived(milestones?.milestones ?? []);
  const unlockedCount = $derived(list.filter((m) => m.unlocked).length);
  const totalCount = $derived(list.length);
</script>

<div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
  <div class="mb-3 flex items-center justify-between">
    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Milestones</p>
    <span class="text-xs tabular-nums text-slate-500">
      {unlockedCount}/{totalCount}
    </span>
  </div>

  <div class="grid gap-2">
    {#each list as milestone (milestone.id)}
      {@const presentation = PRESENTATION[milestone.id] ?? FALLBACK}
      {@const Icon = presentation.icon}
      <div
        class={cn(
          "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
          milestone.unlocked
            ? "border-amber-400/20 bg-amber-950/20"
            : "border-white/[0.04] bg-transparent",
        )}
      >
        <div
          class={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            milestone.unlocked ? "bg-amber-400/20" : "bg-white/[0.04]",
          )}
        >
          <Icon
            class={cn("size-4", milestone.unlocked ? "text-amber-300" : "text-slate-600")}
          />
        </div>
        <div class="min-w-0 flex-1">
          <p
            class={cn(
              "text-sm font-medium",
              milestone.unlocked ? "text-amber-100" : "text-slate-400",
            )}
          >
            {presentation.label}
          </p>
          <p class="text-xs text-slate-500">{presentation.description}</p>
        </div>
        {#if milestone.unlocked}
          <Trophy class="size-4 shrink-0 text-amber-300" />
        {:else}
          <span class="text-xs tabular-nums text-slate-600">
            {Math.round(Math.min(1, Math.max(0, milestone.progress)) * 100)}%
          </span>
        {/if}
      </div>
    {/each}
  </div>
</div>
