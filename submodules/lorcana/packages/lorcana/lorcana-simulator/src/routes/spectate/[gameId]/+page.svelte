<script lang="ts">
  import { goto } from '$app/navigation';
  import { onDestroy, onMount } from 'svelte';
  import { Button } from '$lib/design-system/primitives/button';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/design-system/primitives/card';
  import { getGatewayWsUrl } from '$lib/config/public-url-config.js';
  import { GatewayClientStore, createGatewayStore, destroyGatewayStore } from '@/features/gateway/gateway-client.svelte.js';
  import { LorcanaTabletopSimulator } from '$lib';
  import { SpectatorMatchOrchestrator, type SpectatorRecentHistory } from '@/features/spectator/spectator-match-orchestrator.svelte.js';
  import { buildAcceptedMove } from '../../matches/[matchId]/games/[gameId]/modes/game-mode-message-router.js';
  import { MatchChatController } from '@/features/match-chat/match-chat-controller.svelte.js';
  import type { CardsMaps, LorcanaMatchState } from '@tcg/lorcana-engine';
  import { trackEvent } from '$lib/analytics/analytics.js';
  import { authSession } from '$lib/auth/session.svelte.js';
  import type { ChatMessage } from '@tcg/shared';

  let { data } = $props();
  const getGameId = (): string => data.gameId;

  const GATEWAY_WS_URL = getGatewayWsUrl();

  let gateway: GatewayClientStore | null = null;
  let orchestrator = $state<SpectatorMatchOrchestrator | null>(null);
  let loading = $state(true);
  let loadError = $state<string | null>(null);
  let matchChatController = $state<MatchChatController | null>(null);

  async function handleReturnToMatchmaking(): Promise<void> {
    await goto('/matchmaking');
  }

  function parseStateUpdatePayload(msg: Record<string, unknown>) {
    const engineLogs = Array.isArray(msg.engineLogs)
      ? (msg.engineLogs as SpectatorRecentHistory['engineLogs'])
      : undefined;
    const moveType = typeof msg.moveType === 'string' ? msg.moveType : undefined;
    // state_update has no top-level actorId — extract from the matching engineLog
    const moveLog = engineLogs?.find(
      (e) => (e.log as { moveType?: string } | null)?.moveType === moveType,
    );
    const actorId =
      typeof (moveLog?.log as { playerId?: string } | null)?.playerId === 'string'
        ? (moveLog!.log as { playerId: string }).playerId
        : undefined;
    const acceptedMove = buildAcceptedMove(
      actorId,
      moveType,
      typeof msg.stateVersion === 'number' ? msg.stateVersion : undefined,
      engineLogs,
      msg.state,
    );
    return {
      actorId: String(msg.actorId ?? ''),
      moveType: String(msg.moveType ?? ''),
      stateVersion: Number(msg.stateVersion ?? 0),
      patches: Array.isArray(msg.patches) ? msg.patches : [],
      state: msg.state ?? undefined,
      cardsMaps:
        msg.cardsMaps && typeof msg.cardsMaps === 'object'
          ? (msg.cardsMaps as CardsMaps)
          : undefined,
      acceptedMove: acceptedMove as SpectatorRecentHistory['acceptedMoves'][number] | undefined,
      engineLogs,
    };
  }

  function initOrchestrator(
    gw: GatewayClientStore,
    state: LorcanaMatchState,
    cardsMaps: CardsMaps,
    recentHistory?: { type: string; [key: string]: unknown },
  ): SpectatorMatchOrchestrator {
    return new SpectatorMatchOrchestrator({
      gateway: gw,
      state,
      cardsMaps,
      recentHistory:
        recentHistory &&
        typeof recentHistory === 'object' &&
        !Array.isArray(recentHistory)
          ? (recentHistory as unknown as {
              acceptedMoves: Array<{
                actorId: string;
                moveId: string;
                stateVersion: number;
                timestamp: number;
                turnNumber: number;
                input?: unknown;
              }>;
              engineLogs: Array<{
                stateVersion: number;
                log: unknown;
              }>;
            })
          : undefined,
    });
  }

  async function initSpectatorView(): Promise<void> {
    const gameId = getGameId();
    console.trace('[spectate] init', { gameId });

    let gameJoinedResolve:
      | ((msg: { type: string; [key: string]: unknown }) => void)
      | null = null;
    const gameJoinedPromise = new Promise<{
      type: string;
      [key: string]: unknown;
    }>((resolve) => {
      gameJoinedResolve = resolve;
    });

    // matchId arrives either in game_joined or game_chat_history (whichever comes first).
    let matchIdResolve: ((id: string) => void) | null = null;
    const matchIdPromise = new Promise<string>((resolve) => {
      matchIdResolve = resolve;
    });

    // For client-authority games, game_joined may have null state.
    // We queue state_update messages and wait for the first one with full state.
    let deferredStateResolve: ((msg: Record<string, unknown>) => void) | null =
      null;
    const pendingUpdates: Record<string, unknown>[] = [];

    gateway = createGatewayStore(GATEWAY_WS_URL, undefined, (msg) => {
      if (msg.type === 'game_joined') {
        console.trace('[spectate] game_joined received', {
          gameId: msg.gameId,
          matchId: msg.matchId,
          stateVersion: msg.stateVersion,
          hasState: msg.state != null,
          hasCardsMaps: msg.cardsMaps != null,
          role: msg.role,
        });
        if (typeof msg.matchId === 'string' && msg.matchId) {
          matchIdResolve?.(msg.matchId);
        }
        gameJoinedResolve?.(msg);
        return;
      }

      if (msg.type === 'state_update') {
        if (!orchestrator && deferredStateResolve && msg.state) {
          deferredStateResolve(msg as Record<string, unknown>);
          deferredStateResolve = null;
          return;
        }
        if (!orchestrator) {
          pendingUpdates.push(msg as Record<string, unknown>);
          return;
        }
        orchestrator.applyStateUpdate(
          parseStateUpdatePayload(msg as Record<string, unknown>),
        );
        return;
      }

      if (msg.type === 'game_chat_history') {
        const chatMatchId =
          typeof msg.matchId === 'string' ? msg.matchId : null;
        console.trace('[spectate] game_chat_history received', {
          matchId: chatMatchId,
        });
        if (chatMatchId) {
          matchIdResolve?.(chatMatchId);
        }
        if (matchChatController) {
          matchChatController.hydrateHistory(
            chatMatchId ?? '',
            Array.isArray(msg.messages) ? (msg.messages as ChatMessage[]) : [],
            { freeTextEnabled: (msg as Record<string, unknown>).freeTextEnabled === true },
          );
        }
        return;
      }

      if (msg.type === 'chat_message' && matchChatController && msg.message) {
        matchChatController.receiveMessage(
          String(msg.matchId ?? ''),
          msg.message as ChatMessage,
        );
        return;
      }

      if (msg.type === 'error' || msg.type === 'gateway_error') {
        loadError =
          typeof msg.message === 'string'
            ? msg.message
            : 'Unable to spectate this match.';
      }
    }, undefined, undefined, () => authSession.session?.token);
    matchChatController = new MatchChatController({
      gameId,
      canSend: false,
      sendMessage: () => undefined,
    });

    gateway.connect();
    console.trace('[spectate] connecting to gateway');

    const welcomePromise = new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (gateway?.connectionId) {
          clearInterval(interval);
          resolve();
        }
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        resolve();
      }, 10_000);
    });

    await welcomePromise;

    if (!gateway.connectionId) {
      loadError = 'Failed to connect to the game server.';
      return;
    }

    console.trace('[spectate] connected', {
      connectionId: gateway.connectionId,
    });
    gateway.send({ type: 'join_game', gameId, role: 'spectator' });
    console.trace('[spectate] sent join_game', { gameId });

    const gameJoinedMsg = await Promise.race([
      gameJoinedPromise,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 10_000)),
    ]);

    if (!gameJoinedMsg) {
      loadError = 'Timed out while joining the live match.';
      return;
    }

    // Wait briefly for matchId — arrives in game_joined or game_chat_history (usually within 1ms).
    // Use it to redirect to the consolidated route which server-prefetches cardsMaps.
    const matchId = await Promise.race([
      matchIdPromise,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1_000)),
    ]);

    if (matchId) {
      console.trace('[spectate] redirecting to consolidated route', {
        matchId,
        gameId,
      });
      await goto(`/matches/${matchId}/games/${gameId}?spectate`, {
        replaceState: true,
      });
      return; // onDestroy will clean up the gateway
    }

    console.trace('[spectate] no matchId received, using legacy flow');

    // Both practice and ranked matches now use the same flat format:
    // game_joined.state = raw LorcanaMatchState, game_joined.cardsMaps = CardsMaps
    let state = gameJoinedMsg.state as LorcanaMatchState | null;
    let cardsMaps =
      (gameJoinedMsg.cardsMaps as CardsMaps | undefined) ?? undefined;

    // If state is null (client-authority game, player hasn't pushed yet),
    // wait for the first state_update which includes the full state + cardsMaps.
    if (!state || !cardsMaps) {
      console.trace(
        '[spectate] waiting for state_update (no cardsMaps in game_joined)',
        {
          hasState: state != null,
          hasCardsMaps: cardsMaps != null,
        },
      );
      const deferredPromise = new Promise<Record<string, unknown>>(
        (resolve) => {
          deferredStateResolve = resolve;
        },
      );

      const firstUpdate = await Promise.race([
        deferredPromise,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 15_000)),
      ]);

      if (!firstUpdate?.state) {
        console.trace('[spectate] TIMEOUT after 15s waiting for state_update');
        loadError =
          'Timed out waiting for match state. The player may not have started yet.';
        return;
      }

      state = firstUpdate.state as LorcanaMatchState;
      cardsMaps =
        firstUpdate.cardsMaps && typeof firstUpdate.cardsMaps === 'object'
          ? (firstUpdate.cardsMaps as CardsMaps)
          : cardsMaps;

      if (!cardsMaps) {
        loadError = 'Match state is missing card data (cardsMaps).';
        return;
      }
    }

    orchestrator = initOrchestrator(
      gateway,
      state,
      cardsMaps,
      gameJoinedMsg.recentHistory as
        | { type: string; [key: string]: unknown }
        | undefined,
    );

    for (const pending of pendingUpdates.splice(0)) {
      orchestrator.applyStateUpdate(parseStateUpdatePayload(pending));
    }
  }

  let spectateStartTime = 0;

  onMount(async () => {
    spectateStartTime = Date.now();
    trackEvent('spectate_start');
    try {
      await initSpectatorView();
    } catch (error) {
      loadError =
        error instanceof Error
          ? error.message
          : 'Failed to initialize spectator view.';
    } finally {
      loading = false;
    }
  });

  onDestroy(() => {
    if (spectateStartTime > 0) {
      trackEvent('spectate_end', {
        duration_seconds: Math.round((Date.now() - spectateStartTime) / 1000),
      });
    }
    orchestrator?.dispose();
    destroyGatewayStore();
  });
</script>

<main class="relative min-h-screen text-slate-100">
  {#if loading}
    <div class="grid min-h-screen place-items-center px-4 text-slate-400">
      Joining live match...
    </div>
  {:else if loadError}
    <div
      class="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-8"
    >
      <Card class="w-full border-rose-400/20 bg-slate-950/88 text-slate-100">
        <CardHeader>
          <CardTitle>Spectator view unavailable</CardTitle>
          <CardDescription class="text-rose-200">{loadError}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onclick={() => goto('/matchmaking')}
            >Back to matchmaking</Button
          >
        </CardContent>
      </Card>
    </div>
  {:else if orchestrator}
    <LorcanaTabletopSimulator
      engine={orchestrator.currentEngine}
      readModel={orchestrator.readModel}
      viewerMode="spectator"
      {matchChatController}
      onReturnToMatchmaking={handleReturnToMatchmaking}
    />
  {/if}
</main>
