<script lang="ts">
  import { Card, CardContent } from '$lib/design-system/primitives/card';
  import { m } from '$lib/i18n/messages.js';
  import { cn } from '$lib/utils.js';
  import {
    SURFACE_CARD_CLASS,
    type PlayTab,
  } from './matchmaking-lobby.constants.js';
  import { getMatchmakingLobbyContext } from './useMatchmakingLobbyController.svelte.js';
  import { authSession } from '$lib/auth/session.svelte.js';
  import MatchmakingQueueCard from './MatchmakingQueueCard.svelte';
  import MatchmakingLobbyPanel from './MatchmakingLobbyPanel.svelte';
  import MatchmakingPracticePanel from './MatchmakingPracticePanel.svelte';
  import MatchmakingColorFilterCard from './MatchmakingColorFilterCard.svelte';
  import Bot from '@lucide/svelte/icons/bot';
  import Swords from '@lucide/svelte/icons/swords';
  import Users from '@lucide/svelte/icons/users';

  interface Props {
    initialTab?: PlayTab;
  }

  let { initialTab = 'find-match' }: Props = $props();

  const controller = getMatchmakingLobbyContext();

  // Initial tab is intentionally fixed at mount; user changes update `activeTab` only.
  // svelte-ignore state_referenced_locally
  let activeTab = $state<PlayTab>(initialTab);

  function countBits(n: number): number {
    let c = 0;
    let v = n;
    while (v) { c += v & 1; v >>>= 1; }
    return c;
  }

  // Auto-switch to Find Match tab when a match is found or ready
  $effect(() => {
    const status = controller.queue.status;
    if (status === 'match_found' || status === 'match_ready') {
      activeTab = 'find-match';
    }
  });

  const tabs: Array<{ id: PlayTab; icon: typeof Swords; labelKey: string }> = [
    { id: 'find-match', icon: Swords, labelKey: 'sim.matchmaking.matchmaking.title' },
    { id: 'lobby', icon: Users, labelKey: 'sim.matchmaking.lobby.title' },
    { id: 'practice', icon: Bot, labelKey: 'sim.matchmaking.practice.eyebrow' },
  ];

  const isQueued = $derived(controller.queue.status === 'queued');
</script>

    <!-- Tab bar -->
    <div
      class="inline-flex w-full rounded-full border border-white/10 bg-black/35 p-1"
      role="tablist"
      aria-label="Play mode"
    >
      {#each tabs as tab}
        <button
          type="button"
          role="tab"
          class={cn(
            'relative flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors',
            activeTab === tab.id
              ? 'bg-white text-slate-950'
              : 'text-slate-300 hover:bg-white/8 hover:text-white',
          )}
          aria-selected={activeTab === tab.id}
          onclick={() => { activeTab = tab.id; }}
        >
          <tab.icon class="size-4" aria-hidden="true" />
          <span class="hidden sm:inline">{m[tab.labelKey]({})}</span>
          {#if tab.id === 'find-match' && isQueued && activeTab !== 'find-match'}
            <span
              class="absolute right-2 top-1.5 size-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.6)]"
              aria-label="Searching for match"
            ></span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Tab content -->
    {#if activeTab === 'find-match'}
      <MatchmakingQueueCard
        status={controller.queue.status}
        position={controller.queueStore.position}
        isAuthenticated={controller.auth.isAuthenticated}
        savingSelection={
          controller.playerContext.savingDeck || controller.playerContext.savingProfile
        }
        selectionDisabled={controller.deckSelection.selectionDisabled}
        wsConnected={controller.gateway.status === 'connected'}
        selectedQueueMode={controller.queue.selectedQueueMode}
        selectedMatchType={controller.queue.selectedMatchType}
        rankedEnabled={controller.queue.rankedEnabled}
        testingEnabled={controller.queue.testingQueueEnabled}
        cards={controller.queue.queueCards}
        isDeckValidForSelectedFormat={controller.queue.isDeckValidForSelectedFormat}
        hasDeckSelected={controller.deckSelection.selectedDeck !== null}
        activeQueueFormat={controller.queue.activeQueueFormat}
        activeQueueMode={controller.queue.activeQueueMode}
        queuedDeck={controller.queue.queuedDeck}
        queuedProfile={controller.queue.queuedProfile}
        queueActionDisabled={controller.queue.queueActionDisabled}
        queueActionDisabledLabel={controller.queue.queueActionDisabledLabel}
        joinLabel={controller.queue.joinLabel}
        elapsedLabel={controller.queue.elapsedLabel}
        remainingLabel={controller.queue.remainingLabel}
        progressPercent={controller.queue.progressPercent}
        error={controller.queue.error}
        queuedAiError={controller.queue.queuedAiError}
        matchCountdown={controller.queueStore.matchCountdown}
        opponentDisplayName={controller.queueStore.opponentDisplayName}
        colorPreferenceCount={countBits(controller.queueStore.preferredOpponentColors) + countBits(controller.queueStore.excludedOpponentColors)}
        modeStats={controller.queue.modeStats}
        matchTypeStats={controller.queue.matchTypeStats}
        selfAccepted={controller.queueStore.selfAccepted}
        opponentAccepted={controller.queueStore.opponentAccepted}
        acceptTimeRemainingMs={controller.queueStore.acceptTimeRemainingMs}
        onSelectQueueMode={(mode) => controller.selectQueueMode(mode)}
        onSelectMatchType={(matchType) => controller.selectMatchType(matchType)}
        onSelectQueueFormat={(format) => controller.selectQueueFormat(format)}
        onJoinQueue={() => controller.handleJoinQueue()}
        onLeaveQueue={() => controller.handleLeaveQueue()}
        onSkipCountdown={() => controller.skipMatchCountdown()}
        onAcceptMatch={() => controller.handleAcceptMatch()}
        onDeclineMatch={() => controller.handleDeclineMatch()}
      >
        {#snippet colorFilter()}
          {#if controller.queue.selectedMatchType === 'casual'}
            <MatchmakingColorFilterCard
              preferredColors={controller.queueStore.preferredOpponentColors}
              excludedColors={controller.queueStore.excludedOpponentColors}
              strength={controller.queueStore.colorPreferenceStrength}
              disabled={controller.deckSelection.selectionDisabled}
              onUpdate={(preferred, excluded, strength) =>
                controller.handleColorPreferenceUpdate(preferred, excluded, strength)}
            />
          {/if}
        {/snippet}
      </MatchmakingQueueCard>
    {:else if activeTab === 'lobby'}
      <MatchmakingLobbyPanel
        isAuthenticated={authSession.isAuthenticated}
        hasSelectedDeck={controller.deckSelection.selectedDeck !== null}
        lobbyStatus={controller.lobby.status}
        lobbyRoomCode={controller.lobby.roomCode}
        lobbyError={controller.lobby.error}
        lobbyExistingRoomCode={controller.lobby.existingRoomCode}
        lobbySelectedMode={controller.lobby.selectedMode}
        lobbyActiveMatchId={controller.lobby.activeMatchId}
        forfeiting={controller.queueStore.forfeiting}
        onCreateRoom={() => controller.handleCreateLobbyRoom()}
        onJoinRoom={(code) => controller.handleJoinLobbyRoom(code)}
        onCancelRoom={() => controller.handleCancelLobbyRoom()}
        onRejoinExistingRoom={() => controller.handleRejoinExistingRoom()}
        onCancelExistingRoom={() => controller.handleCancelExistingRoom()}
        onLobbyModeChange={(mode) => controller.handleLobbyModeChange(mode)}
        onRejoinMatch={() => controller.handleRejoinMatch()}
        onForfeitMatch={() => controller.handleForfeitMatch()}
      />
    {:else if activeTab === 'practice'}
      <MatchmakingPracticePanel
        isAuthenticated={authSession.isAuthenticated}
        hasSelectedDeck={controller.deckSelection.selectedDeck !== null}
        practiceLoading={controller.practice.loading}
        practiceError={controller.practice.error}
        selectedBotFixtureId={controller.botConfig.selectedBotFixtureId}
        selectedBotStrategyId={controller.botConfig.selectedBotStrategyId}
        botFixtureOptions={controller.botConfig.fixtureOptions}
        botStrategyOptions={controller.botConfig.strategyOptions}
        botStrategyDescription={controller.botConfig.strategyDescription}
        onBotFixtureChange={(fixtureId) => controller.handleBotFixtureChange(fixtureId)}
        onBotStrategyChange={(strategyId) => controller.handleBotStrategyChange(strategyId)}
        onStartPracticeMatch={() => controller.startPracticeMatch()}
      />
    {/if}

