<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/design-system/primitives/button";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import {
    listCommunities,
    getCommunityLeaderboard,
    getLeagueStandings,
    type Community,
    type CommunityLeaderboardResponse,
    type CommunityLeagueStandingsResponse,
  } from "$lib/features/matchmaking/api/community-api.js";
  import type { LeaderboardType } from "$lib/features/matchmaking/api/leaderboard-api.js";

  const PAGE_TITLE = "Community Hub - Lorcana Simulator";

  const TAB_TYPES = [
    "mmr",
    "weekly",
    "win-streak",
  ] as const satisfies readonly LeaderboardType[];

  let communities = $state<Community[]>([]);
  let communitiesLoading = $state(true);
  let communitiesError = $state<string | null>(null);

  let selectedPublicId = $state<string | null>(null);
  let leaderboardType = $state<(typeof TAB_TYPES)[number]>("mmr");
  let leaderboard = $state<CommunityLeaderboardResponse | null>(null);
  let leaderboardLoading = $state(false);
  let leaderboardError = $state<string | null>(null);

  let leagueIdInput = $state("");
  let standings = $state<CommunityLeagueStandingsResponse | null>(null);
  let standingsLoading = $state(false);
  let standingsError = $state<string | null>(null);

  async function loadCommunities(): Promise<void> {
    communitiesLoading = true;
    communitiesError = null;
    try {
      communities = await listCommunities(50);
    } catch (e) {
      communitiesError =
        e instanceof Error ? e.message : "Failed to load communities";
    } finally {
      communitiesLoading = false;
    }
  }

  async function loadLeaderboard(): Promise<void> {
    if (!selectedPublicId) {
      leaderboard = null;
      return;
    }
    leaderboardLoading = true;
    leaderboardError = null;
    try {
      leaderboard = await getCommunityLeaderboard({
        communityPublicId: selectedPublicId,
        type: leaderboardType,
        limit: 25,
      });
    } catch (e) {
      leaderboardError =
        e instanceof Error ? e.message : "Failed to load leaderboard";
      leaderboard = null;
    } finally {
      leaderboardLoading = false;
    }
  }

  function selectCommunity(c: Community): void {
    selectedPublicId = c.publicId;
    void loadLeaderboard();
  }

  function setLeaderboardTab(t: (typeof TAB_TYPES)[number]): void {
    leaderboardType = t;
    void loadLeaderboard();
  }

  async function fetchLeagueStandings(): Promise<void> {
    if (!selectedPublicId) {
      standingsError = "Select a community first";
      return;
    }
    const leagueId = leagueIdInput.trim();
    if (!leagueId) {
      standingsError = "Enter a league ID";
      return;
    }
    standingsLoading = true;
    standingsError = null;
    standings = null;
    try {
      standings = await getLeagueStandings(selectedPublicId, leagueId);
    } catch (e) {
      standingsError =
        e instanceof Error ? e.message : "Failed to load standings";
    } finally {
      standingsLoading = false;
    }
  }

  onMount(() => {
    void loadCommunities();
  });
</script>

<svelte:head>
  <title>{PAGE_TITLE}</title>
</svelte:head>

<div class="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-3xl pb-10 pt-2">
    <div class="mb-6 flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        class="text-slate-400 hover:text-slate-200"
        onclick={() => goto("/matchmaking")}
      >
        <ArrowLeft class="size-4" />
      </Button>
      <h1 class="text-lg font-semibold tracking-tight text-slate-100">
        Community Hub
      </h1>
    </div>

    <section class="mb-8 rounded-lg border border-white/10 bg-slate-950/40 p-4">
      <h2 class="mb-3 text-sm font-medium text-slate-200">Communities</h2>
      {#if communitiesLoading}
        <p class="text-sm text-slate-400">Loading communities…</p>
      {:else if communitiesError}
        <p class="text-sm text-red-400">{communitiesError}</p>
        <Button
          variant="outline"
          size="sm"
          class="mt-2"
          onclick={() => loadCommunities()}>Retry</Button
        >
      {:else if communities.length === 0}
        <p class="text-sm text-slate-400">No communities found.</p>
      {:else}
        <ul class="flex max-h-48 flex-col gap-1 overflow-y-auto">
          {#each communities as c (c.publicId)}
            <li>
              <button
                type="button"
                class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors {selectedPublicId ===
                c.publicId
                  ? 'bg-white/10 text-slate-100'
                  : 'text-slate-300 hover:bg-white/5'}"
                onclick={() => selectCommunity(c)}
              >
                <span class="font-medium">{c.name}</span>
                {#if c.description}
                  <span class="mt-0.5 block text-xs text-slate-500"
                    >{c.description}</span
                  >
                {/if}
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <section class="mb-8 rounded-lg border border-white/10 bg-slate-950/40 p-4">
      <h2 class="mb-3 text-sm font-medium text-slate-200">Leaderboard</h2>
      {#if !selectedPublicId}
        <p class="text-sm text-slate-400">
          Select a community to view its leaderboard.
        </p>
      {:else}
        <div class="mb-3 flex flex-wrap gap-1">
          {#each TAB_TYPES as t (t)}
            <button
              type="button"
              class="rounded-md px-3 py-1.5 text-xs font-medium capitalize {leaderboardType ===
              t
                ? 'bg-white/15 text-slate-100'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}"
              onclick={() => setLeaderboardTab(t)}
            >
              {t === "win-streak" ? "Win streak" : t}
            </button>
          {/each}
        </div>
        {#if leaderboardLoading}
          <p class="text-sm text-slate-400">Loading leaderboard…</p>
        {:else if leaderboardError}
          <p class="text-sm text-red-400">{leaderboardError}</p>
        {:else if leaderboard && leaderboard.entries.length === 0}
          <p class="text-sm text-slate-400">No entries yet.</p>
        {:else if leaderboard}
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead>
                <tr class="border-b border-white/10 text-xs text-slate-500">
                  <th class="pb-2 pr-4 font-medium">#</th>
                  <th class="pb-2 pr-4 font-medium">Player</th>
                  <th class="pb-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {#each leaderboard.entries as row (row.gameProfileId)}
                  <tr class="border-b border-white/5">
                    <td class="py-2 pr-4 text-slate-400">{row.rank}</td>
                    <td class="py-2 pr-4"
                      >{row.displayName ??
                        row.gameProfileId.slice(0, 8) + "…"}</td
                    >
                    <td class="py-2 tabular-nums">{row.value}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      {/if}
    </section>

    <section class="rounded-lg border border-white/10 bg-slate-950/40 p-4">
      <h2 class="mb-3 text-sm font-medium text-slate-200">League standings</h2>
      <p class="mb-3 text-xs text-slate-500">
        Uses the selected community. Enter a league ID from that community.
      </p>
      <div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label class="flex flex-1 flex-col gap-1 text-xs text-slate-400">
          League ID
          <input
            bind:value={leagueIdInput}
            type="text"
            placeholder="League UUID"
            class="rounded-md border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
          />
        </label>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          class="shrink-0"
          disabled={standingsLoading}
          onclick={() => fetchLeagueStandings()}
        >
          {standingsLoading ? "Loading…" : "Load standings"}
        </Button>
      </div>
      {#if standingsError}
        <p class="text-sm text-red-400">{standingsError}</p>
      {/if}
      {#if standings && standings.standings.length > 0}
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead>
              <tr class="border-b border-white/10 text-xs text-slate-500">
                <th class="pb-2 pr-3 font-medium">#</th>
                <th class="pb-2 pr-3 font-medium">Player</th>
                <th class="pb-2 pr-3 font-medium">P</th>
                <th class="pb-2 pr-3 font-medium">W</th>
                <th class="pb-2 pr-3 font-medium">L</th>
                <th class="pb-2 pr-3 font-medium">Pts</th>
                <th class="pb-2 font-medium">WR</th>
              </tr>
            </thead>
            <tbody>
              {#each standings.standings as s (s.gameProfileId)}
                <tr class="border-b border-white/5">
                  <td class="py-2 pr-3 text-slate-400">{s.rank}</td>
                  <td class="py-2 pr-3"
                    >{s.displayName ?? s.gameProfileId.slice(0, 8) + "…"}</td
                  >
                  <td class="py-2 pr-3 tabular-nums">{s.played}</td>
                  <td class="py-2 pr-3 tabular-nums">{s.wins}</td>
                  <td class="py-2 pr-3 tabular-nums">{s.losses}</td>
                  <td class="py-2 pr-3 tabular-nums">{s.points}</td>
                  <td class="py-2 tabular-nums">{s.winRate.toFixed(1)}%</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else if standings && standings.standings.length === 0}
        <p class="mt-2 text-sm text-slate-400">No standings for this league.</p>
      {/if}
    </section>
  </div>
</div>
