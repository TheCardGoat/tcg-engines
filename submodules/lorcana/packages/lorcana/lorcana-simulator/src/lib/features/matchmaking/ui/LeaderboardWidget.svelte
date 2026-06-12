<script lang="ts">
  import { cn } from "$lib/utils.js";
  import Trophy from "@lucide/svelte/icons/trophy";
  import Medal from "@lucide/svelte/icons/medal";
  import Flame from "@lucide/svelte/icons/flame";
  import Heart from "@lucide/svelte/icons/heart";
  import { SURFACE_CARD_CLASS } from "./matchmaking-lobby.constants.js";
  import {
    fetchLeaderboard,
    type LeaderboardResponse,
    type LeaderboardType,
  } from "../api/leaderboard-api.js";

  interface Props {
    gameSlug?: string;
    gameProfileId?: string | null;
    initialData?: LeaderboardResponse[] | null;
  }

  let { gameSlug = "lorcana", gameProfileId = null, initialData = null }: Props = $props();

  type TabDef = {
    type: LeaderboardType;
    label: string;
    icon: typeof Trophy;
    valueLabel: string;
  };

  const allTabs: TabDef[] = [
    { type: "mmr", label: "MMR", icon: Trophy, valueLabel: "MMR" },
    { type: "weekly", label: "Week", icon: Medal, valueLabel: "Games" },
    { type: "win-streak", label: "Streaks", icon: Flame, valueLabel: "Streak" },
    { type: "sportsmanship", label: "Sports", icon: Heart, valueLabel: "Credits" },
  ];

  // Track which tabs have data and the cached responses
  let tabData = $state<Map<LeaderboardType, LeaderboardResponse>>(new Map());
  let initialLoadDone = $state(false);
  let activeTab = $state<LeaderboardType>("mmr");
  let loading = $state(false);

  // Use server-provided data if available, otherwise fetch client-side
  $effect(() => {
    if (initialData && initialData.length > 0) {
      hydrateFromInitialData(initialData);
    } else {
      fetchAllTabs();
    }
  });

  function hydrateFromInitialData(data: LeaderboardResponse[]) {
    const newMap = new Map<LeaderboardType, LeaderboardResponse>();
    for (const entry of data) {
      if (entry.entries.length > 0) {
        newMap.set(entry.type, entry);
      }
    }
    tabData = newMap;
    initialLoadDone = true;
    loading = false;
    if (newMap.size > 0 && !newMap.has(activeTab)) {
      activeTab = newMap.keys().next().value!;
    }
  }

  async function fetchAllTabs() {
    loading = true;
    const results = await Promise.allSettled(
      allTabs.map(async (tab) => {
        const res = await fetchLeaderboard(gameSlug, tab.type, gameProfileId ?? undefined, 10);
        return { type: tab.type, res };
      }),
    );

    const newMap = new Map<LeaderboardType, LeaderboardResponse>();
    for (const result of results) {
      if (result.status === "fulfilled" && result.value.res.entries.length > 0) {
        newMap.set(result.value.type, result.value.res);
      }
    }
    tabData = newMap;
    initialLoadDone = true;
    loading = false;

    // Auto-select the first tab that has data
    if (newMap.size > 0 && !newMap.has(activeTab)) {
      activeTab = newMap.keys().next().value!;
    }
  }

  const visibleTabs = $derived(allTabs.filter((t) => tabData.has(t.type)));
  const activeData = $derived(tabData.get(activeTab) ?? null);
  const activeTabDef = $derived(allTabs.find((t) => t.type === activeTab)!);
  const hasAnyData = $derived(tabData.size > 0);

  function selectTab(type: LeaderboardType) {
    activeTab = type;
  }

  function formatValue(value: number, type: LeaderboardType): string {
    if (type === "mmr") return Math.round(value).toString();
    return value.toString();
  }
</script>

{#if loading && !initialLoadDone}
  <!-- silent initial load -->
{:else if hasAnyData}
  <div class={cn(SURFACE_CARD_CLASS, "rounded-xl px-3 py-3")}>
    <div class="mb-2 flex items-center justify-between">
      <span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Leaderboard
      </span>
      <span class="text-[10px] text-slate-600">{activeTabDef.valueLabel}</span>
    </div>

    {#if visibleTabs.length > 1}
      <div class="flex gap-0.5 rounded-md bg-white/5 p-0.5">
        {#each visibleTabs as tab}
          {@const Icon = tab.icon}
          <button
            class={cn(
              "flex flex-1 items-center justify-center gap-1 rounded px-1.5 py-1 text-[10px] font-medium transition-colors",
              activeTab === tab.type
                ? "bg-white/10 text-white"
                : "text-slate-500 hover:text-slate-300",
            )}
            onclick={() => selectTab(tab.type)}
          >
            <Icon class="size-2.5" />
            {tab.label}
          </button>
        {/each}
      </div>
    {/if}

    {#if activeData}
      <div class={visibleTabs.length > 1 ? "mt-2" : ""}>
        {#each activeData.entries.slice(0, 10) as entry}
          {@const isCurrentPlayer = gameProfileId && entry.gameProfileId === gameProfileId}
          <div
            class={cn(
              "flex items-center gap-1 rounded px-1.5 py-[3px] text-[11px]",
              isCurrentPlayer && "bg-blue-500/8 text-blue-300",
            )}
          >
            <span
              class={cn(
                "w-5 shrink-0 font-semibold tabular-nums",
                entry.rank === 1 ? "text-amber-400" : entry.rank === 2 ? "text-slate-400" : entry.rank === 3 ? "text-amber-600" : "text-slate-600",
              )}
            >
              {entry.rank}
            </span>
            <span class={cn("flex-1 truncate", isCurrentPlayer ? "text-blue-300" : "text-slate-300")}>
              {entry.displayName ?? "Anonymous"}
            </span>
            <span class="shrink-0 tabular-nums text-slate-500">
              {formatValue(entry.value, activeTab)}
            </span>
          </div>
        {/each}

        {#if activeData.playerEntry && activeData.playerEntry.rank > 10}
          <div class="mt-1 border-t border-white/5 pt-1">
            <div class="flex items-center gap-1 rounded bg-blue-500/8 px-1.5 py-[3px] text-[11px] text-blue-300">
              <span class="w-5 shrink-0 font-semibold tabular-nums">{activeData.playerEntry.rank}</span>
              <span class="flex-1 truncate">{activeData.playerEntry.displayName ?? "You"}</span>
              <span class="shrink-0 tabular-nums">{formatValue(activeData.playerEntry.value, activeTab)}</span>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}
