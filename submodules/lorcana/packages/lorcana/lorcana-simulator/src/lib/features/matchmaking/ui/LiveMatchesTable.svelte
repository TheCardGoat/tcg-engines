<script lang="ts">
  import { Badge } from '$lib/design-system/primitives/badge';
  import { Button } from '$lib/design-system/primitives/button';
  import { m } from "$lib/i18n/messages.js";
  import { getInkSymbolUrl } from '$lib/features/simulator/model/asset-urls.js';
  import Eye from '@lucide/svelte/icons/eye';
  import Smartphone from '@lucide/svelte/icons/smartphone';
  import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
  import X from '@lucide/svelte/icons/x';
  import Star from '@lucide/svelte/icons/star';
  import Gem from '@lucide/svelte/icons/gem';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';
  import type { LiveMatchesStore } from '../state/live-matches.svelte.js';
  import { trackEvent } from '$lib/analytics/analytics.js';
  import { resolvePatronTierConfig } from "@/features/simulator/model/player-tier.js";

  const INK_TYPES = ["amber", "amethyst", "emerald", "ruby", "sapphire", "steel"] as const;
  type InkType = typeof INK_TYPES[number];

  interface Props {
    store: LiveMatchesStore;
    onSpectateInline?: (matchId: string, gameId: string) => void;
  }

  let { store, onSpectateInline }: Props = $props();

  const remaining = $derived(store.total - store.matches.length);

  let now = $state(Date.now());
  $effect(() => {
    const interval = setInterval(() => { now = Date.now(); }, 10_000);
    return () => clearInterval(interval);
  });

  // Filter panel visibility
  let filtersOpen = $state(false);

  // Filter state (local UI state — changes call store.setFilters)
  let selectedInks = $state<InkType[]>([]);
  let selectedMatchType = $state<string | undefined>(undefined);
  let selectedFormat = $state<"best_of_1" | "best_of_3" | undefined>(undefined);

  const hasActiveFilters = $derived(
    selectedInks.length > 0 || selectedMatchType !== undefined || selectedFormat !== undefined
  );

  function applyFilters(): void {
    store.setFilters({
      inks: selectedInks.length > 0 ? [...selectedInks] : undefined,
      matchType: selectedMatchType,
      format: selectedFormat,
    });
  }

  function toggleInk(ink: InkType): void {
    if (selectedInks.includes(ink)) {
      selectedInks = selectedInks.filter((i) => i !== ink);
    } else {
      selectedInks = [...selectedInks, ink];
    }
    applyFilters();
  }

  function setMatchType(type: string | undefined): void {
    selectedMatchType = selectedMatchType === type ? undefined : type;
    applyFilters();
  }

  function setFormat(fmt: "best_of_1" | "best_of_3" | undefined): void {
    selectedFormat = selectedFormat === fmt ? undefined : fmt;
    applyFilters();
  }

  function clearFilters(): void {
    selectedInks = [];
    selectedMatchType = undefined;
    selectedFormat = undefined;
    applyFilters();
  }

  function handleShowMore(): void {
    store.showMore();
  }

  function formatScore(p1: number, p2: number): string {
    return `${p1}\u2013${p2}`;
  }

  function formatDuration(createdAt: string, currentTime: number): string {
    const diffMs = currentTime - new Date(createdAt).getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return '<1m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h${minutes % 60}m`;
  }
</script>

<div class="space-y-3">
  <div class="flex flex-wrap items-center gap-2">
    <span class="relative flex size-2.5">
      <span
        class="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"
      ></span>
      <span class="relative inline-flex size-2.5 rounded-full bg-red-500"
      ></span>
    </span>
    <h3 class="text-sm font-semibold uppercase tracking-widest text-slate-200">
      {m['sim.matchmaking.liveGames.title']({})}
    </h3>
    <Badge
      variant="secondary"
      class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold text-white shadow-none"
    >
      {m['sim.matchmaking.matchmaking.stats.liveChip']({ count: store.total })}
    </Badge>

    <!-- Filter toggle button -->
    <button
      type="button"
      onclick={() => (filtersOpen = !filtersOpen)}
      title={m['sim.matchmaking.liveGames.filter.toggle']({})}
      class="ml-auto flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] transition-colors {filtersOpen || hasActiveFilters
        ? 'border-sky-400/50 bg-sky-400/15 text-sky-300'
        : 'border-white/10 bg-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'}"
    >
      <SlidersHorizontal class="size-3" />
      {#if hasActiveFilters}
        <span class="size-1.5 rounded-full bg-sky-400"></span>
      {/if}
    </button>
  </div>

  <!-- Collapsible filter panel -->
  {#if filtersOpen}
    <div class="space-y-2 rounded-lg border border-white/8 bg-white/3 px-3 py-2.5">
      <!-- Ink filter -->
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="w-8 text-[0.6rem] font-medium uppercase tracking-wider text-slate-500">
          {m['sim.matchmaking.liveGames.filter.ink']({})}
        </span>
        {#each INK_TYPES as ink}
          <button
            type="button"
            onclick={() => toggleInk(ink)}
            title={ink}
            class="size-5 rounded-full transition-all focus:outline-none {selectedInks.includes(ink)
              ? 'ring-2 ring-white/60 ring-offset-1 ring-offset-transparent opacity-100'
              : 'opacity-35 hover:opacity-65'}"
          >
            <img src={getInkSymbolUrl(ink)} alt={ink} class="size-full" />
          </button>
        {/each}
      </div>

      <!-- Match type + format filters -->
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="w-8 text-[0.6rem] font-medium uppercase tracking-wider text-slate-500">
          {m['sim.matchmaking.liveGames.filter.type']({})}
        </span>
        {#each [
          { key: 'ranked', label: m['sim.matchmaking.liveGames.filter.type.ranked']({}) },
          { key: 'casual', label: m['sim.matchmaking.liveGames.filter.type.casual']({}) },
          { key: 'practice_vs_bot', label: m['sim.matchmaking.liveGames.filter.type.bot']({}) },
        ] as type}
          <button
            type="button"
            onclick={() => setMatchType(type.key)}
            class="rounded-full border px-2 py-0.5 text-[0.6rem] font-medium transition-colors {selectedMatchType === type.key
              ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
              : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-300'}"
          >
            {type.label}
          </button>
        {/each}

        <span class="text-white/10">·</span>

        {#each [
          { key: 'best_of_1' as const, label: m['sim.matchmaking.liveGames.formatBo1']({}) },
          { key: 'best_of_3' as const, label: m['sim.matchmaking.liveGames.formatBo3']({}) },
        ] as fmt}
          <button
            type="button"
            onclick={() => setFormat(fmt.key)}
            class="rounded-full border px-2 py-0.5 text-[0.6rem] font-medium transition-colors {selectedFormat === fmt.key
              ? 'border-sky-400/50 bg-sky-400/20 text-sky-200'
              : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-300'}"
          >
            {fmt.label}
          </button>
        {/each}

        {#if hasActiveFilters}
          <button
            type="button"
            onclick={clearFilters}
            class="ml-auto flex items-center gap-0.5 text-[0.6rem] text-slate-500 hover:text-slate-300"
          >
            <X class="size-2.5" />
            {m['sim.matchmaking.liveGames.filter.clear']({})}
          </button>
        {/if}
      </div>
    </div>
  {/if}

  {#if store.matches.length === 0}
    <p class="py-4 text-center text-sm text-slate-400">
      {m['sim.matchmaking.liveGames.empty']({})}
    </p>
  {:else}
    <div class="space-y-2">
      {#each store.matches as match (match.matchId)}
        <button
          type="button"
          class="w-full rounded-lg border border-white/8 bg-white/3 px-3 py-2.5 text-left transition-colors hover:border-white/15 hover:bg-white/6 {match.currentGameId ? 'cursor-pointer' : ''}"
          onclick={() => {
            if (match.currentGameId) {
              trackEvent("live_match_spectate");
              if (onSpectateInline) {
                onSpectateInline(match.matchId, match.currentGameId);
              } else {
                window.open(`/matches/${match.matchId}/games/${match.currentGameId}?spectate`, '_blank');
              }
            }
          }}
        >
          <!-- Row 1: Players -->
          <div class="flex items-center gap-1.5 text-sm">
            <div class="flex min-w-0 items-center gap-1">
              {#each match.player1Inks as ink, i}
                <img src={getInkSymbolUrl(ink)} alt={ink} class="size-4 shrink-0 {i > 0 ? '-ml-1.5' : ''}" />
              {/each}
              <span class="ml-1 truncate font-medium text-slate-200">{match.player1.displayName}</span>
              {#if match.player1.isMobile}
                <Smartphone class="size-3 shrink-0 text-slate-500" />
              {/if}
              {#if Number.isFinite(match.player1.mmr)}
                <span class="live-mmr shrink-0">#{Math.round(match.player1.mmr!)}</span>
              {/if}
              {#if resolvePatronTierConfig(match.player1.subscriptionTier)}
                {@const cfg = resolvePatronTierConfig(match.player1.subscriptionTier)!}
                <span
                  class="live-patron shrink-0"
                  style:--patron-color={cfg.color}
                  style:--patron-glow={cfg.glow}
                  style:--patron-border={cfg.borderColor}
                  title={cfg.name()}
                >
                  {#if cfg.icon === 'sparkles'}
                    <Sparkles class="size-[9px]" />
                  {:else if cfg.icon === 'gem'}
                    <Gem class="size-[9px]" />
                  {:else if cfg.icon === 'shield'}
                    <ShieldCheck class="size-[9px]" />
                  {:else}
                    <Star class="size-[9px]" />
                  {/if}
                </span>
              {/if}
            </div>
            <span class="shrink-0 text-xs text-slate-500">vs</span>
            <div class="flex min-w-0 items-center gap-1">
              {#each match.player2Inks as ink, i}
                <img src={getInkSymbolUrl(ink)} alt={ink} class="size-4 shrink-0 {i > 0 ? '-ml-1.5' : ''}" />
              {/each}
              <span class="ml-1 truncate font-medium text-slate-200">{match.player2.displayName}</span>
              {#if match.player2.isMobile}
                <Smartphone class="size-3 shrink-0 text-slate-500" />
              {/if}
              {#if Number.isFinite(match.player2.mmr)}
                <span class="live-mmr shrink-0">#{Math.round(match.player2.mmr!)}</span>
              {/if}
              {#if resolvePatronTierConfig(match.player2.subscriptionTier)}
                {@const cfg = resolvePatronTierConfig(match.player2.subscriptionTier)!}
                <span
                  class="live-patron shrink-0"
                  style:--patron-color={cfg.color}
                  style:--patron-glow={cfg.glow}
                  style:--patron-border={cfg.borderColor}
                  title={cfg.name()}
                >
                  {#if cfg.icon === 'sparkles'}
                    <Sparkles class="size-[9px]" />
                  {:else if cfg.icon === 'gem'}
                    <Gem class="size-[9px]" />
                  {:else if cfg.icon === 'shield'}
                    <ShieldCheck class="size-[9px]" />
                  {:else}
                    <Star class="size-[9px]" />
                  {/if}
                </span>
              {/if}
            </div>
          </div>
          <!-- Row 2: Metadata -->
          <div class="mt-1 flex items-center gap-2 text-[0.65rem] text-slate-500">
            <span class="font-mono">Turn {match.turnNumber || '\u2014'}</span>
            <span class="text-white/10">&middot;</span>
            <span>{formatDuration(match.createdAt, now)}</span>
            <span class="text-white/10">&middot;</span>
            <span>{match.format === 'best_of_3' ? m['sim.matchmaking.liveGames.formatBo3']({}) : m['sim.matchmaking.liveGames.formatBo1']({})}</span>
            <span class="ml-auto inline-flex items-center gap-0.5 {match.currentGameId ? 'text-sky-300' : 'text-slate-500'}">
              <Eye class="size-3" />
              <span class="tabular-nums">{match.spectatorCount}</span>
            </span>
          </div>
        </button>
      {/each}
    </div>

    {#if remaining > 0}
      <Button
        variant="ghost"
        size="sm"
        class="w-full text-xs text-slate-400 hover:text-white"
        onclick={handleShowMore}
      >
        {m['sim.matchmaking.liveGames.showMore']({ count: remaining })}
      </Button>
    {/if}
  {/if}
</div>

<style>
  .live-mmr {
    font-size: 0.6rem;
    font-weight: 600;
    color: rgba(148, 163, 184, 0.55);
    white-space: nowrap;
  }

  .live-patron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--patron-border);
    color: var(--patron-color);
    box-shadow:
      0 0 4px var(--patron-glow),
      0 0 8px var(--patron-glow);
    cursor: default;
  }
</style>
