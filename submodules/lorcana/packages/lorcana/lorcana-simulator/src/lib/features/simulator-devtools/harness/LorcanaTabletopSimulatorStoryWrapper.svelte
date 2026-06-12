<script lang="ts">
  import {
    LorcanaTabletopSimulator,
    type LorcanaPlayerSettingsMap,
    type LorcanaSimulatorReadModel,
    type LorcanaSimulatorView,
    type SimulatorDebugAnimationPlayer,
    type SimulatorDebugAnimationRequest,
  } from '$lib';
  import type { LorcanaGameContext } from '@/features/simulator/context/game-context.svelte.js';
  import type { PlayerInteractionView } from '@tcg/lorcana-interaction';
  import { getLorcanaFixture } from '@/features/simulator-devtools/fixtures';
  import { LorcanaMultiplayerSimulatorAdapter } from '@/features/simulator-devtools/harness';
  import { buildSimulatorAssetUrl } from '$lib/config/public-url-config.js';

  import LorcanaDebugControls from './LorcanaDebugControls.svelte';

  import type { LorcanaSimulatorFixture } from '@/features/simulator/model/contracts';
  import type { LorcanaSimulatorLocale } from '@/features/simulator/model/contracts';
  import {
    type BrowserTransportConfig,
    LorcanaMultiplayerTestEngine,
    normalizeBrowserTransportConfig,
  } from '@tcg/lorcana-engine/testing';

  interface StoryWrapperProps {
    browserTransport?: BrowserTransportConfig;
    fixture?: LorcanaSimulatorFixture;
    fixtureId: string;
    initialView: LorcanaSimulatorView;
    locale?: LorcanaSimulatorLocale;
    frameWidth?: string;
    frameHeight?: string;
    onFixtureChange?: (fixtureId: string) => void;
  }

  const PLAYER_LOCALE_STORAGE_KEY = 'lorcana.simulator.playerLocale';
  const TEST_PLAYER_ONE_CARD_BACK_URL = buildSimulatorAssetUrl(
    'card-back/back-cosmos.webp',
  );
  const TEST_PLAYER_TWO_CARD_BACK_URL = buildSimulatorAssetUrl(
    'card-back/back-yellow.webp',
  );

  let {
    browserTransport = { mode: 'sync' },
    fixtureId,
    fixture: fixtureProp,
    initialView,
    locale: storyLocale = 'en',
    frameWidth = '100%',
    frameHeight = '100vh',
    onFixtureChange,
  }: StoryWrapperProps = $props();

  let wrapperElement = $state<HTMLDivElement | null>(null);
  let serializedState = $state<string>('No state available.');
  let serializedBoardProjection = $state<string>(
    'No board projection available.',
  );
  let serializedInteractionPrompt = $state<string>(
    'No interaction prompt available.',
  );
  let currentViewOverride = $state<LorcanaSimulatorView | null>(null);
  let debugStateId = $state<number | null>(null);
  let currentView = $derived(currentViewOverride ?? initialView);

  let fixture = $derived<LorcanaSimulatorFixture>(
    fixtureProp || getLorcanaFixture(fixtureId),
  );
  let normalizedBrowserTransport = $derived(
    normalizeBrowserTransportConfig(browserTransport),
  );
  let testEngine = $derived.by<LorcanaMultiplayerTestEngine>(() => {
    return LorcanaMultiplayerTestEngine.createWithFixture(
      fixture.playerOne,
      fixture.playerTwo,
      {
        browserTransport: normalizedBrowserTransport,
        seed: fixture.seed ?? 'simulator-default',
        skipPreGame: fixture.skipPreGame ?? true,
        validateSync: false,
        debugServerCommunication: true,
      },
    );
  });

  let engine = $derived.by(() => {
    if (currentView === 'spectator') {
      return testEngine.asServer();
    }

    if (currentView === 'playerOne') {
      return testEngine.asPlayerOne();
    }

    if (currentView === 'playerTwo') {
      return testEngine.asPlayerTwo();
    }

    return testEngine.asServer();
  });

  let readModel = $derived.by<Pick<LorcanaSimulatorReadModel, 'getMoveLog'>>(
    () => {
      const adapter = new LorcanaMultiplayerSimulatorAdapter(testEngine);
      return {
        getMoveLog: (limit?: number) => adapter.getMoveLog(limit, currentView),
      };
    },
  );

  let playerSettings = $derived.by<LorcanaPlayerSettingsMap>(() => {
    const [playerOneId, playerTwoId] = testEngine
      .getBoard(currentView)
      .playerOrder.map(String);

    return {
      [playerOneId]: {
        cardBack: TEST_PLAYER_ONE_CARD_BACK_URL,
        // playmat: TEST_PLAYER_ONE_PLAYMAT_URL,
      },
      [playerTwoId]: {
        cardBack: TEST_PLAYER_TWO_CARD_BACK_URL,
        // playmat: TEST_PLAYER_TWO_PLAYMAT_URL,
      },
    };
  });

  function refreshDebugPayloads(): void {
    debugStateId = testEngine.getStateID();
    serializedState = JSON.stringify(
      testEngine.getAuthoritativeState(),
      null,
      2,
    );
    serializedBoardProjection = JSON.stringify(
      testEngine.getBoard(currentView),
      null,
      2,
    );
    serializedInteractionPrompt = JSON.stringify(
      interactionViewRef ?? gameContextRef?.interactionView ?? null,
      null,
      2,
    );
  }

  $effect(() => {
    const activeFixtureId = fixtureId;
    const activeView = currentView;

    refreshDebugPayloads();

    const playerOneEngine = testEngine.getClientEngine('playerOne');
    const playerTwoEngine = testEngine.getClientEngine('playerTwo');

    const unsubscribePlayerOne =
      playerOneEngine?.engine.onStateUpdate(() => {
        refreshDebugPayloads();
      }) ?? (() => {});
    const unsubscribePlayerTwo =
      playerTwoEngine?.engine.onStateUpdate(() => {
        refreshDebugPayloads();
      }) ?? (() => {});

    return () => {
      void activeFixtureId;
      void activeView;
      unsubscribePlayerOne();
      unsubscribePlayerTwo();
    };
  });

  function setCurrentView(nextView: LorcanaSimulatorView): void {
    if (currentView === nextView) {
      return;
    }

    currentViewOverride = nextView;
  }

  function swapPlayers(): void {
    const nextView = currentView === 'playerTwo' ? 'playerOne' : 'playerTwo';
    setCurrentView(nextView);
  }

  function resetToInitialFixture(): void {
    currentViewOverride = null;
  }

  let gameContextRef = $state<LorcanaGameContext | null>(null);
  let interactionViewRef = $state<PlayerInteractionView | null>(null);

  function runAnimation(animation: SimulatorDebugAnimationRequest): boolean {
    if (!gameContextRef) {
      return false;
    }
    return gameContextRef.runAnimation(animation);
  }

  function runQuestAnimation(
    cardId: string,
    player: SimulatorDebugAnimationPlayer,
    loreGained: number,
  ): boolean {
    if (!gameContextRef) {
      return false;
    }
    const side =
      player === 'player_one' ? ('playerOne' as const) : ('playerTwo' as const);
    return gameContextRef.runQuestAnimation(cardId, side, loreGained);
  }

  function runChallengeAnimation(
    attackerId: string,
    defenderId: string,
    player: SimulatorDebugAnimationPlayer,
    preview: {
      attackerDamageDealt: number;
      defenderDamageDealt: number;
      defenderKind: 'character' | 'location';
      attackerWouldBeBanished: boolean;
      defenderWouldBeBanished: boolean;
      attackerDamageIsReduced: boolean;
      defenderDamageIsReduced: boolean;
    },
  ): boolean {
    if (!gameContextRef) {
      return false;
    }
    const side =
      player === 'player_one' ? ('playerOne' as const) : ('playerTwo' as const);
    return gameContextRef.runChallengeAnimation(
      attackerId,
      defenderId,
      side,
      preview,
    );
  }
</script>

<div
  class="story-wrapper dark"
  style={`--story-frame-width: ${frameWidth}; --story-frame-height: ${frameHeight};`}
  bind:this={wrapperElement}
>
  {#if engine}
    <LorcanaTabletopSimulator
      {engine}
      {readModel}
      {playerSettings}
      bind:gameContext={gameContextRef}
      bind:interactionView={interactionViewRef}
    />

    <LorcanaDebugControls
      {wrapperElement}
      {fixtureId}
      view={currentView}
      stateId={debugStateId}
      {serializedState}
      {serializedBoardProjection}
      {serializedInteractionPrompt}
      onViewChange={setCurrentView}
      {onFixtureChange}
      onSwapPlayers={swapPlayers}
      onReset={resetToInitialFixture}
      onRefresh={() => {}}
      onRunAnimation={runAnimation}
      onRunQuestAnimation={runQuestAnimation}
      onRunChallengeAnimation={runChallengeAnimation}
    />
  {:else}
    <p class="loading">Loading...</p>
  {/if}
</div>

<style>
  .story-wrapper {
    position: relative;
    width: min(100%, var(--story-frame-width, 100%));
    height: var(--story-frame-height, 100vh);
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    padding: 0 !important;
  }

  .loading {
    margin: 0;
    height: 100%;
    display: grid;
    place-items: center;
    color: #d4e2f3;
    font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
  }
</style>
