<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button } from '$lib/design-system/primitives/button';
  import * as Popover from '$lib/design-system/primitives/popover/index.js';
  import * as Tooltip from '$lib/design-system/primitives/tooltip/index.js';
  import { m } from '$lib/i18n/messages.js';
  import { cn } from '$lib/utils.js';
  import type {
    QueueStatsFormat,
    QueueStatsMode,
  } from '../api/queue-stats-api.js';
  import type { MatchmakingStatus } from '../state/matchmaking-queue.svelte.js';
  import type {
    ProfileDeckSummary,
    ProfileMatchmakingContext,
  } from '../api/player-context-api.js';
  import type { QueueCardView } from './matchmaking-lobby.constants.js';
  import { Badge } from '$lib/design-system/primitives/badge';
  import { getInkSymbolUrl } from '@/features/simulator/model/asset-urls.js';
  import { LORCANA_INK_NAMES } from '@/features/simulator/model/lorcana-colors.js';
  import CheckCircle from '@lucide/svelte/icons/check-circle-2';
  import CircleHelp from '@lucide/svelte/icons/circle-help';
  import Flame from '@lucide/svelte/icons/flame';
  import InfinityIcon from '@lucide/svelte/icons/infinity';
  import Layers from '@lucide/svelte/icons/layers';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import LogIn from '@lucide/svelte/icons/log-in';
  import Swords from '@lucide/svelte/icons/swords';
  import Timer from '@lucide/svelte/icons/timer';
  import ShieldAlert from '@lucide/svelte/icons/shield-alert';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Users from '@lucide/svelte/icons/users';
  import WifiOff from '@lucide/svelte/icons/wifi-off';
  import X from '@lucide/svelte/icons/x';

  interface Props {
    status: MatchmakingStatus;
    position: number | null;
    isAuthenticated: boolean;
    savingSelection: boolean;
    selectionDisabled: boolean;
    wsConnected: boolean;
    selectedQueueMode: QueueStatsMode;
    selectedMatchType: 'ranked' | 'casual' | 'testing';
    rankedEnabled: boolean;
    testingEnabled: boolean;
    cards: QueueCardView[];
    isDeckValidForSelectedFormat: boolean;
    hasDeckSelected: boolean;
    activeQueueFormat: QueueStatsFormat;
    activeQueueMode: QueueStatsMode;
    queuedDeck: ProfileDeckSummary | null;
    queuedProfile: ProfileMatchmakingContext | null;
    queueActionDisabled: boolean;
    queueActionDisabledLabel: string;
    joinLabel: string;
    elapsedLabel: string;
    remainingLabel: string;
    progressPercent: number;
    error: string | null;
    queuedAiError: string | null;
    matchCountdown: number | null;
    opponentDisplayName: string | null;
    selfAccepted: boolean;
    opponentAccepted: boolean;
    acceptTimeRemainingMs: number;
    colorPreferenceCount: number;
    modeStats: ReadonlyArray<{ mode: QueueStatsMode; inQueue: number; liveMatches: number }>;
    matchTypeStats: ReadonlyArray<{
      matchType: 'ranked' | 'casual';
      inQueue: number;
      liveMatches: number;
    }>;
    colorFilter?: Snippet;
    onSelectQueueMode: (mode: QueueStatsMode) => void;
    onSelectMatchType: (matchType: 'ranked' | 'casual' | 'testing') => void;
    onSelectQueueFormat: (format: QueueStatsFormat) => void;
    onJoinQueue: () => void | Promise<void>;
    onLeaveQueue: () => void | Promise<void>;
    onSkipCountdown: () => void;
    onAcceptMatch: () => void;
    onDeclineMatch: () => void;
  }

  let {
    status,
    position,
    isAuthenticated,
    savingSelection,
    selectionDisabled,
    wsConnected,
    selectedQueueMode,
    selectedMatchType,
    rankedEnabled,
    testingEnabled,
    cards,
    isDeckValidForSelectedFormat,
    hasDeckSelected,
    activeQueueFormat,
    activeQueueMode,
    queuedDeck,
    queuedProfile,
    queueActionDisabled,
    queueActionDisabledLabel,
    joinLabel,
    elapsedLabel,
    remainingLabel,
    progressPercent,
    error,
    queuedAiError,
    matchCountdown,
    opponentDisplayName,
    selfAccepted,
    opponentAccepted,
    colorPreferenceCount,
    modeStats,
    matchTypeStats,
    colorFilter,
    acceptTimeRemainingMs,
    onSelectQueueMode,
    onSelectMatchType,
    onSelectQueueFormat,
    onJoinQueue,
    onLeaveQueue,
    onSkipCountdown,
    onAcceptMatch,
    onDeclineMatch,
  }: Props = $props();

  const RANKED_TOOLTIP_TEXT = m['sim.matchmaking.matchmaking.rankedComingSoon']({});

  const rankedStats = $derived(
    matchTypeStats.find((s) => s.matchType === 'ranked') ?? { inQueue: 0, liveMatches: 0 },
  );
  const casualStats = $derived(
    matchTypeStats.find((s) => s.matchType === 'casual') ?? { inQueue: 0, liveMatches: 0 },
  );

  function formatProfileName(displayName: string | null | undefined): string {
    return displayName?.trim().length ? displayName : 'Unnamed profile';
  }

  function stopCardSelection(event: MouseEvent): void {
    event.stopPropagation();
  }
</script>

<div class="space-y-4">
  <!-- Match type selector (Ranked / Casual) -->
  <div
    class="inline-flex w-full rounded-full border border-white/10 bg-black/35 p-1"
    role="tablist"
    aria-label="Match type"
  >
    {#if rankedEnabled}
      <button
        type="button"
        role="tab"
        class={cn(
          'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
          selectedMatchType === 'ranked'
            ? 'bg-white text-slate-950'
            : 'text-slate-300 hover:bg-white/8 hover:text-white',
        )}
        aria-selected={selectedMatchType === 'ranked'}
        disabled={selectionDisabled}
        onclick={() => onSelectMatchType('ranked')}
      >
        <span class="flex flex-col items-center gap-0.5">
          <span>Ranked</span>
          <span class={cn(
            'inline-flex items-center gap-1 text-[0.65rem]',
            selectedMatchType === 'ranked' ? 'text-slate-500' : 'text-slate-400',
          )}>
            <Swords class="size-3" aria-hidden="true" />
            {rankedStats.liveMatches}
            <Users class="size-3" aria-hidden="true" />
            {rankedStats.inQueue}
          </span>
        </span>
      </button>
    {:else}
      <Tooltip.Root delayDuration={120}>
        <Tooltip.Trigger>
          {#snippet child({ props })}
            <span class="inline-flex flex-1" {...props}>
              <button
                type="button"
                role="tab"
                class={cn(
                  'w-full rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition-colors',
                  'cursor-not-allowed opacity-80',
                )}
                aria-selected={false}
                aria-disabled="true"
                disabled
              >
                Ranked
                <span
                  class="ml-1.5 inline-block rounded-full border border-amber-400/30 bg-amber-500/15 px-1.5 py-0 text-[0.6rem] align-middle font-semibold uppercase tracking-wider text-amber-300"
                >Soon</span>
              </button>
            </span>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top"
          class="border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
        >
          {RANKED_TOOLTIP_TEXT}
        </Tooltip.Content>
      </Tooltip.Root>
    {/if}

    <button
      type="button"
      role="tab"
      class={cn(
        'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
        selectedMatchType === 'casual'
          ? 'bg-white text-slate-950'
          : 'text-slate-300 hover:bg-white/8 hover:text-white',
      )}
      aria-selected={selectedMatchType === 'casual'}
      disabled={selectionDisabled}
      onclick={() => onSelectMatchType('casual')}
    >
      <span class="flex flex-col items-center gap-0.5">
        <span>Casual</span>
        <span class={cn(
          'inline-flex items-center gap-1 text-[0.65rem]',
          selectedMatchType === 'casual' ? 'text-slate-500' : 'text-slate-400',
        )}>
          <Swords class="size-3" aria-hidden="true" />
          {casualStats.liveMatches}
          <Users class="size-3" aria-hidden="true" />
          {casualStats.inQueue}
        </span>
      </span>
    </button>

    {#if testingEnabled}
      <button
        type="button"
        role="tab"
        class={cn(
          'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
          selectedMatchType === 'testing'
            ? 'bg-white text-slate-950'
            : 'text-slate-300 hover:bg-white/8 hover:text-white',
        )}
        aria-selected={selectedMatchType === 'testing'}
        disabled={selectionDisabled}
        onclick={() => onSelectMatchType('testing')}
      >
        {m['sim.matchmaking.matchmaking.testingTab']({})}
      </button>
    {/if}
  </div>

  <!-- BO1 / BO3 selector — hidden for ranked (BO3 only) -->
  {#if selectedMatchType !== 'ranked'}
  <div class="flex items-center justify-end gap-3">
    <div
      class="inline-flex w-full rounded-full border border-white/10 bg-black/35 p-1 sm:w-auto"
      role="tablist"
      aria-label={m['sim.matchmaking.matchmaking.modeTabsAria']({})}
    >
      {#each modeStats as ms}
        {@const isActive = selectedQueueMode === ms.mode}
        <Tooltip.Root delayDuration={120}>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <button
                type="button"
                role="tab"
                class={cn(
                  'min-w-[6rem] rounded-full px-3 py-2 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-white text-slate-950'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white',
                )}
                aria-selected={isActive}
                disabled={selectionDisabled}
                {...props}
                onclick={() => onSelectQueueMode(ms.mode)}
              >
                <span class="flex flex-col items-center gap-0.5">
                  <span>
                    {ms.mode === '1'
                      ? m['sim.matchmaking.matchmaking.tabs.bo1']({})
                      : m['sim.matchmaking.matchmaking.tabs.bo3']({})}
                  </span>
                  <span class={cn(
                    'inline-flex items-center gap-1 text-[0.65rem]',
                    isActive ? 'text-slate-500' : 'text-slate-400',
                  )}>
                    <Swords class="size-3" aria-hidden="true" />
                    {ms.liveMatches}
                    <Users class="size-3" aria-hidden="true" />
                    {ms.inQueue}
                  </span>
                </span>
              </button>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content
            side="top"
            class="border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
          >
            {ms.liveMatches} {m['sim.matchmaking.matchmaking.stats.liveLabel']({})} · {ms.inQueue} {m['sim.matchmaking.matchmaking.stats.inQueueLabel']({})}
          </Tooltip.Content>
        </Tooltip.Root>
      {/each}
    </div>
  </div>
  {/if}

  <div class="space-y-4">
      {#if status === 'match_found'}
        <div
          class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5"
          role="alert"
        >
          <div class="flex flex-col items-center gap-3 text-center">
            <CheckCircle class="size-8 text-emerald-400" aria-hidden="true" />
            <div>
              <p class="text-base font-bold text-emerald-100">
                {m['sim.matchmaking.queue.matchFound.title']({})}
              </p>
              <!--  opponentDisplayName is returning player's id, which is not very useful -->
              <!-- We should also only show player display name on quick matches, to avoind competitive players dogding unfavorable matchups -->
              <!-- {#if opponentDisplayName}
              <p class="mt-1 text-sm text-emerald-200/80">
                vs {opponentDisplayName}
              </p>
            {/if} -->
            </div>

            {#if matchCountdown !== null}
              <div class="mt-1 flex items-center justify-center">
                <span
                  class="inline-flex size-12 items-center justify-center rounded-full border-2 border-emerald-400/40 bg-emerald-500/15 text-2xl font-bold tabular-nums text-emerald-100"
                  aria-live="polite"
                >
                  {matchCountdown}
                </span>
              </div>
              <p class="text-xs text-emerald-200/70">
                Joining match in {matchCountdown}
                {matchCountdown === 1 ? 'second' : 'seconds'}…
              </p>
            {/if}

            <button
              type="button"
              onclick={onSkipCountdown}
              class="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 transition-colors hover:bg-emerald-500/30"
            >
              <Swords class="size-4" aria-hidden="true" />
              Join now
            </button>
          </div>
        </div>
      {/if}

      {#if status === 'match_ready'}
        <div
          class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5"
          role="alert"
        >
          <div class="flex flex-col items-center gap-4 text-center">
            <Swords class="size-8 text-amber-400" aria-hidden="true" />
            <div>
              <p class="text-lg font-bold text-amber-100">Match Found!</p>
              <p class="mt-1 text-sm text-amber-200/70">
                Both players must accept to start the game
              </p>
            </div>

            <!-- Player status cards -->
            <div class="grid w-full grid-cols-2 gap-3">
              <!-- You -->
              <div
                class={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors',
                  selfAccepted
                    ? 'border-emerald-400/50 bg-emerald-500/10'
                    : 'border-white/10 bg-white/5',
                )}
              >
                <div
                  class={cn(
                    'flex size-12 items-center justify-center rounded-full',
                    selfAccepted ? 'bg-emerald-500/20' : 'bg-white/10',
                  )}
                >
                  {#if selfAccepted}
                    <CheckCircle
                      class="size-6 text-emerald-400"
                      aria-hidden="true"
                    />
                  {:else}
                    <Users class="size-6 text-slate-400" aria-hidden="true" />
                  {/if}
                </div>
                <p class="text-sm font-semibold text-white">You</p>
                <p
                  class={cn(
                    'text-xs font-medium',
                    selfAccepted ? 'text-emerald-300' : 'text-slate-400',
                  )}
                >
                  {selfAccepted ? 'Ready' : 'Waiting...'}
                </p>
              </div>

              <!-- Opponent -->
              <div
                class={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors',
                  opponentAccepted
                    ? 'border-emerald-400/50 bg-emerald-500/10'
                    : 'border-white/10 bg-white/5',
                )}
              >
                <div
                  class={cn(
                    'flex size-12 items-center justify-center rounded-full',
                    opponentAccepted ? 'bg-emerald-500/20' : 'bg-white/10',
                  )}
                >
                  {#if opponentAccepted}
                    <CheckCircle
                      class="size-6 text-emerald-400"
                      aria-hidden="true"
                    />
                  {:else}
                    <Users class="size-6 text-slate-400" aria-hidden="true" />
                  {/if}
                </div>
                <p class="text-sm font-semibold text-white">
                  {opponentDisplayName ? `Opponent` : 'Opponent'}
                </p>
                <p
                  class={cn(
                    'text-xs font-medium',
                    opponentAccepted ? 'text-emerald-300' : 'text-slate-400',
                  )}
                >
                  {opponentAccepted ? 'Ready' : 'Waiting...'}
                </p>
              </div>
            </div>

            <!-- Countdown -->
            <div class="flex items-center gap-2 text-sm text-amber-200/80">
              <Timer class="size-4" aria-hidden="true" />
              <span aria-live="polite">
                {Math.ceil(acceptTimeRemainingMs / 1000)} seconds remaining
              </span>
            </div>

            <!-- Action buttons -->
            <div class="grid w-full grid-cols-2 gap-3">
              <Button
                variant="outline"
                class="h-11 border-white/15 bg-transparent text-slate-200 hover:bg-white/10"
                onclick={onDeclineMatch}
              >
                <X class="mr-2 size-4" />
                Decline
              </Button>
              <Button
                class="h-11 bg-emerald-600 text-white hover:bg-emerald-500"
                disabled={selfAccepted}
                onclick={onAcceptMatch}
              >
                {#if selfAccepted}
                  <Loader class="mr-2 size-4 animate-spin" />
                  Accepted
                {:else}
                  <CheckCircle class="mr-2 size-4" />
                  Accept
                {/if}
              </Button>
            </div>
          </div>
        </div>
      {/if}

      {#if status === 'queued'}
        <div
          class={cn(
            'rounded-xl border p-4 transition-colors duration-300',
            wsConnected
              ? 'border-sky-400/20 bg-sky-400/8'
              : 'border-amber-400/25 bg-amber-400/8',
          )}
        >
          <div class="flex items-center gap-3">
            {#if wsConnected}
              <Loader
                class="size-5 shrink-0 animate-spin text-sky-300"
                aria-hidden="true"
              />
            {:else}
              <WifiOff
                class="size-5 shrink-0 text-amber-400"
                aria-hidden="true"
              />
            {/if}
            <div class="min-w-0 flex-1">
              {#if wsConnected}
                <p class="text-sm font-semibold text-sky-100">
                  {m['sim.matchmaking.queue.searching']({})}
                </p>
              {:else}
                <p class="text-sm font-semibold text-amber-200">
                  Connection lost — still in queue
                </p>
                <p class="mt-0.5 text-xs text-amber-300/70">
                  Reconnecting automatically…
                </p>
              {/if}
              <p class="mt-0.5 text-xs text-slate-300">
                {m['sim.matchmaking.matchmaking.queueSummary']({
                  format: m[
                    activeQueueFormat === 'infinity'
                      ? 'sim.matchmaking.matchmaking.formats.infinity'
                      : 'sim.matchmaking.matchmaking.formats.ccROF'
                  ]({}),
                  mode:
                    activeQueueMode === '1'
                      ? m['sim.matchmaking.matchmaking.tabs.bo1']({})
                      : m['sim.matchmaking.matchmaking.tabs.bo3']({}),
                })}
                {#if position}
                  {' · '}
                  {m['sim.matchmaking.matchmaking.stats.placementChip']({
                    count: position,
                  })}
                {/if}
              </p>
              {#if colorPreferenceCount > 0}
                <div class="mt-1 flex items-center gap-1">
                  <Tooltip.Root delayDuration={120}>
                    <Tooltip.Trigger>
                      {#snippet child({ props })}
                        <span
                          class="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-500/15 px-2 py-0.5 text-[0.65rem] font-medium text-sky-300"
                          {...props}
                        >
                          <span class="flex gap-0.5" aria-hidden="true">
                            {#each LORCANA_INK_NAMES as ink}
                              <img
                                src={getInkSymbolUrl(ink)}
                                alt=""
                                aria-hidden="true"
                                class="size-2.5 shrink-0 object-contain opacity-70"
                              />
                            {/each}
                          </span>
                          Color filter · {colorPreferenceCount}
                        </span>
                      {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      class="max-w-52 border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
                    >
                      Opponent color preferences are active. Suggested
                      preferences relax after 60 s if no match is found.
                    </Tooltip.Content>
                  </Tooltip.Root>
                </div>
              {/if}
              {#if queuedProfile || queuedDeck}
                <p class="mt-1 text-xs text-sky-100/80">
                  {#if queuedProfile}
                    {formatProfileName(queuedProfile.displayName)}
                  {/if}
                  {#if queuedProfile && queuedDeck}
                    {' · '}
                  {/if}
                  {#if queuedDeck}
                    {queuedDeck.deckName}
                  {/if}
                </p>
              {/if}
            </div>
          </div>
          <div
            class="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400"
          >
            <div class="flex items-center gap-1.5">
              <Timer class="size-3.5" aria-hidden="true" />
              <span aria-live="polite">
                {m['sim.matchmaking.queue.elapsed']({ time: elapsedLabel })}
              </span>
            </div>
            <span aria-live="polite">
              {m['sim.matchmaking.queue.expiresIn']({ time: remainingLabel })}
            </span>
          </div>
          <div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              class={cn(
                'h-full rounded-full transition-all duration-1000',
                wsConnected ? 'bg-sky-400/60' : 'bg-amber-400/50',
              )}
              style={`width: ${progressPercent}%`}
            ></div>
          </div>
        </div>
      {/if}

      {#if status !== 'queued' && status !== 'match_ready' && status !== 'match_found'}
        <div class="grid gap-3 md:grid-cols-2">
          {#each cards as card}
            <div
              class={cn(
                'group relative overflow-hidden rounded-2xl border p-4 text-left transition-all',
                card.isActive
                  ? 'border-sky-300/70 bg-white/[0.08] shadow-[0_20px_50px_-35px_rgba(125,211,252,0.8)]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]',
                !card.isDeckValid && 'opacity-50',
              )}
            >
              <button
                type="button"
                class="absolute inset-0 z-10 cursor-pointer rounded-2xl disabled:cursor-not-allowed"
                aria-label={`Select ${m[card.definition.labelKey]({})} ${selectedMatchType} queue`}
                aria-pressed={card.isSelected}
                disabled={selectionDisabled}
                onclick={() => onSelectQueueFormat(card.definition.format)}
              ></button>
              <div
                class={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-100',
                  card.definition.accentClass,
                )}
                aria-hidden="true"
              ></div>
              <div class="pointer-events-none relative z-20 flex h-full flex-col gap-3">
                <div class="flex items-start justify-between gap-3">
                  <p class="text-base font-semibold leading-snug text-white">
                    {m[card.definition.labelKey]({})} · {selectedQueueMode === '1'
                      ? m['sim.matchmaking.matchmaking.tabs.bo1']({})
                      : m['sim.matchmaking.matchmaking.tabs.bo3']({})}
                  </p>

                  <!-- Format icon — purely decorative -->
                  {#if card.definition.format === 'infinity'}
                    <InfinityIcon class="size-8 shrink-0 text-sky-300/50" aria-hidden="true" />
                  {:else}
                    <Layers class="size-8 shrink-0 text-amber-300/50" aria-hidden="true" />
                  {/if}
                </div>

                <!-- Validity / selected badge pinned to card top-right corner -->
                {#if !card.isDeckValid}
                  <Tooltip.Root delayDuration={120}>
                    <Tooltip.Trigger>
                      {#snippet child({ props })}
                        <span
                          class="pointer-events-auto absolute right-2.5 top-2.5 inline-flex size-5 items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/15 text-rose-300"
                          {...props}
                        >
                          <ShieldAlert class="size-3" aria-hidden="true" />
                        </span>
                      {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      class="border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
                    >
                      {m['sim.matchmaking.queue.deckNotLegalForFormat']({
                        format: m[card.definition.labelKey]({}),
                      })}
                    </Tooltip.Content>
                  </Tooltip.Root>
                {:else if card.isActive}
                  <Tooltip.Root delayDuration={120}>
                    <Tooltip.Trigger>
                      {#snippet child({ props })}
                        <span
                          class="pointer-events-auto absolute right-2.5 top-2.5 inline-flex size-5 items-center justify-center rounded-full border border-sky-300/30 bg-sky-400/12 text-sky-100"
                          {...props}
                        >
                          <CheckCircle class="size-3" aria-hidden="true" />
                        </span>
                      {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      class="border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
                    >
                      {m['sim.matchmaking.matchmaking.selectedBadge']({})}
                    </Tooltip.Content>
                  </Tooltip.Root>
                {/if}

                <div class="flex flex-wrap gap-2">
                  <Tooltip.Root delayDuration={120}>
                    <Tooltip.Trigger>
                      {#snippet child({ props })}
                        <Badge
                          variant="outline"
                          class="pointer-events-auto border-white/10 bg-black/25 text-slate-200"
                          {...props}
                        >
                          <Swords
                            class="size-3 text-slate-300"
                            aria-hidden="true"
                          />
                          {card.stats?.liveMatches ?? 0}
                        </Badge>
                      {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      class="border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
                    >
                      {m['sim.matchmaking.matchmaking.stats.liveLabel']({})}
                    </Tooltip.Content>
                  </Tooltip.Root>

                  <Tooltip.Root delayDuration={120}>
                    <Tooltip.Trigger>
                      {#snippet child({ props })}
                        <Badge
                          variant="outline"
                          class="pointer-events-auto border-white/10 bg-black/25 text-slate-200"
                          {...props}
                        >
                          <Users
                            class="size-3 text-slate-300"
                            aria-hidden="true"
                          />
                          {card.stats?.inQueue ?? 0}
                        </Badge>
                      {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      side="top"
                      class="border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
                    >
                      {m['sim.matchmaking.matchmaking.stats.inQueueLabel']({})}
                    </Tooltip.Content>
                  </Tooltip.Root>

                  {#if card.winStreak > 0}
                    <Tooltip.Root delayDuration={120}>
                      <Tooltip.Trigger>
                        {#snippet child({ props })}
                          <Badge
                            variant="outline"
                            class="pointer-events-auto border-orange-400/20 bg-orange-500/10 text-orange-200"
                            {...props}
                          >
                            <Flame
                              class="size-3 text-orange-400"
                              aria-hidden="true"
                            />
                            {card.winStreak}
                          </Badge>
                        {/snippet}
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        class="border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
                      >
                        {m['sim.matchmaking.matchmaking.stats.winStreakLabel']({})}
                      </Tooltip.Content>
                    </Tooltip.Root>
                  {/if}

                  {#if card.mmr != null}
                    <Tooltip.Root delayDuration={120}>
                      <Tooltip.Trigger>
                        {#snippet child({ props })}
                          <Badge
                            variant="outline"
                            class="pointer-events-auto border-amber-400/20 bg-amber-500/10 text-amber-200"
                            {...props}
                          >
                            <Trophy
                              class="size-3 text-amber-400"
                              aria-hidden="true"
                            />
                            {card.mmr}
                          </Badge>
                        {/snippet}
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        side="top"
                        class="border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
                      >
                        {m['sim.matchmaking.matchmaking.stats.mmrLabel']({})}
                      </Tooltip.Content>
                    </Tooltip.Root>
                  {/if}
                </div>

                {#if card.rankJourney}
                  {@const journey = card.rankJourney}
                  <div class="mt-auto rounded-xl border border-white/10 bg-black/25 p-3 shadow-inner shadow-black/20">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <Trophy class="size-4 shrink-0 text-amber-300" aria-hidden="true" />
                          <p class="text-sm font-semibold leading-tight text-white">
                            {journey.bracketLabel}
                          </p>
                          {#if journey.mmr != null}
                            <span class="shrink-0 rounded-full bg-amber-400/10 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-200">
                              {journey.mmr} MMR
                            </span>
                          {/if}
                        </div>
                        <p class="mt-1 text-xs font-medium text-sky-100/85">
                          {journey.primaryGoal}
                        </p>
                      </div>

                      <Popover.Root>
                        <Popover.Trigger>
                          {#snippet child({ props })}
                            <button
                              type="button"
                              data-rank-details
                              class="pointer-events-auto inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-200 transition-colors hover:bg-white/15 hover:text-white"
                              aria-label={`${journey.bracketLabel} rank details`}
                              onclick={stopCardSelection}
                              {...props}
                            >
                              <CircleHelp class="size-3.5" aria-hidden="true" />
                            </button>
                          {/snippet}
                        </Popover.Trigger>
                        <Popover.Content
                          side="top"
                          align="end"
                          class="w-72 border border-white/15 bg-slate-950/98 p-0 text-slate-100 shadow-2xl"
                        >
                          <div class="space-y-3 p-4">
                            <div>
                              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Rank details
                              </p>
                              <div class="mt-2 flex items-baseline justify-between gap-3">
                                <p class="text-lg font-semibold text-white">{journey.bracketLabel}</p>
                                <p class="text-sm font-semibold text-amber-200">
                                  {journey.mmr != null ? `${journey.mmr} MMR` : 'Hidden MMR'}
                                </p>
                              </div>
                            </div>

                            <div class="grid grid-cols-3 gap-2 text-center">
                              <div class="rounded-lg bg-white/6 px-2 py-2">
                                <p class="text-[0.65rem] text-slate-400">Games</p>
                                <p class="text-sm font-semibold tabular-nums text-white">{journey.gamesPlayed}</p>
                              </div>
                              <div class="rounded-lg bg-white/6 px-2 py-2">
                                <p class="text-[0.65rem] text-slate-400">Wins</p>
                                <p class="text-sm font-semibold tabular-nums text-white">{journey.gamesWon}</p>
                              </div>
                              <div class="rounded-lg bg-white/6 px-2 py-2">
                                <p class="text-[0.65rem] text-slate-400">Losses</p>
                                <p class="text-sm font-semibold tabular-nums text-white">{journey.losses}</p>
                              </div>
                            </div>

                            <div class="space-y-1.5">
                              <div class="flex items-center justify-between gap-2 text-xs">
                                <span class="font-medium text-slate-200">{journey.progressLabel}</span>
                                <span class="tabular-nums text-slate-400">
                                  {journey.progressValue}/{journey.progressMax}
                                </span>
                              </div>
                              <div
                                class="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                                role="progressbar"
                                aria-valuenow={journey.progressValue}
                                aria-valuemin={0}
                                aria-valuemax={journey.progressMax}
                                aria-label={journey.progressLabel}
                              >
                                <div
                                  class="h-full rounded-full bg-amber-300/80 transition-all duration-500"
                                  style={`width: ${journey.progressPercent}%`}
                                ></div>
                              </div>
                            </div>

                            <div class="rounded-lg border border-sky-300/15 bg-sky-400/8 px-3 py-2 text-xs text-sky-100/85">
                              {#if journey.bracket === 'placement'}
                                Complete 20 ranked games in this format to reveal MMR.
                              {:else if journey.mmrToMaster != null && journey.mmrToMaster > 0}
                                Master needs 80 wins and 1800 MMR. Your wins are ready; keep climbing MMR.
                              {:else if journey.nextBracketLabel}
                                Brackets after placement are driven by ranked wins; MMR sorts players inside the visible ladder.
                              {:else}
                                You have reached the top bracket for this queue.
                              {/if}
                            </div>
                          </div>
                        </Popover.Content>
                      </Popover.Root>
                    </div>

                    <div class="mt-2 space-y-1.5">
                      <div class="flex items-center justify-between gap-2 text-[0.65rem]">
                        <span class="font-medium text-slate-300">{journey.progressLabel}</span>
                        <span class="tabular-nums text-slate-400">
                          {journey.progressValue}/{journey.progressMax}
                        </span>
                      </div>
                      <div
                        class="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                        role="progressbar"
                        aria-valuenow={journey.progressValue}
                        aria-valuemin={0}
                        aria-valuemax={journey.progressMax}
                        aria-label={journey.progressLabel}
                      >
                        <div
                          class="h-full rounded-full bg-sky-400/75 transition-all duration-500"
                          style={`width: ${journey.progressPercent}%`}
                        ></div>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        {#if !isDeckValidForSelectedFormat && hasDeckSelected}
          <div
            class="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3"
            role="alert"
          >
            <ShieldAlert
              class="mt-0.5 size-5 shrink-0 text-amber-400"
              aria-hidden="true"
            />
            <div>
              <p class="text-sm font-semibold text-amber-200">
                {m['sim.matchmaking.queue.deckNotLegalBannerTitle']({})}
              </p>
              <p class="mt-0.5 text-xs text-amber-200/70">
                {m['sim.matchmaking.queue.deckNotLegalBannerDescription']({
                  format:
                    activeQueueFormat === 'infinity'
                      ? m['sim.matchmaking.matchmaking.formats.infinity']({})
                      : m['sim.matchmaking.matchmaking.formats.ccROF']({}),
                })}
              </p>
            </div>
          </div>
        {/if}

        {@render colorFilter?.()}
      {/if}

      {#if error}
        <div
          class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
          role="alert"
        >
          {error}
        </div>
      {/if}

      {#if queuedAiError}
        <div
          class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
          role="alert"
        >
          {queuedAiError}
        </div>
      {/if}

      {#if status === 'queued'}
        <div class="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            class="h-11 w-full border-white/10 bg-transparent text-slate-200 hover:bg-white/5 hover:text-white"
            onclick={onLeaveQueue}
          >
            <X class="mr-2 size-4" />
            {m['sim.matchmaking.queue.cancel']({})}
          </Button>
        </div>
      {:else if status !== 'match_ready' && status !== 'match_found'}
        <Button
          class="h-10 w-full text-sm sm:text-base"
          disabled={queueActionDisabled || !wsConnected}
          aria-busy={status === 'checking' || status === 'joining'}
          onclick={onJoinQueue}
        >
          {#if !wsConnected}
            <Loader class="mr-2 size-4 animate-spin" />
            Connecting…
          {:else if status === 'checking'}
            <Loader class="mr-2 size-4 animate-spin" />
            {m['sim.matchmaking.queue.checkingStatus']({})}
          {:else if status === 'joining'}
            <Loader class="mr-2 size-4 animate-spin" />
            {m['sim.matchmaking.queue.joining']({})}
          {:else if !isAuthenticated}
            <LogIn class="mr-2 size-4" />
            {m['sim.matchmaking.queue.signInToJoin']({})}
          {:else if savingSelection}
            <Loader class="mr-2 size-4 animate-spin" />
            {m['sim.matchmaking.queue.savingSelection']({})}
          {:else if queueActionDisabled}
            {queueActionDisabledLabel}
          {:else}
            {joinLabel}
          {/if}
        </Button>
      {/if}
  </div>
</div>
