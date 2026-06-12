<script lang="ts">
  import AntiRamp from '@tcg/shared/ads/AntiRamp';

  import { goto } from "$app/navigation";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/design-system/primitives/card";
  import { Button } from "$lib/design-system/primitives/button";
  import { getGatewayWsUrl } from "$lib/config/public-url-config.js";
  import { LorcanaTabletopSimulator } from "$lib";
  import { onMount, onDestroy } from "svelte";
  import X from "@lucide/svelte/icons/x";
  import { authSession } from "$lib/auth/session.svelte.js";
  import { trackEvent } from "$lib/analytics/analytics.js";
  import { GatewayClientStore, createGatewayStore, destroyGatewayStore } from "@/features/gateway/gateway-client.svelte.js";
  import { fetchGatewayTicket } from "@/features/gateway/fetch-ticket.js";
  import { fetchQuickMatchTicket } from "@/features/matchmaking/api/quick-match-ticket-api.js";
  import {
    clearPracticeSession,
    loadPracticeSession,
  } from "@/features/practice-match/practice-match-storage.js";
  import { PracticeMatchOrchestrator } from "@/features/practice-match/practice-match-orchestrator.svelte.js";
  import type { PracticeMatchRecentHistory } from "@/features/practice-match/types.js";
  import type { CardsMaps, LorcanaServerAuthoritativeSnapshot } from "@tcg/lorcana-engine";
  import { createHumanVsAiContext } from "@/features/simulator-devtools/vs-ai/context.js";
  import { immersiveExperience } from "$lib/features/immersive/immersive-state.svelte.js";
  import type { LorcanaPlayerSettingsMap } from "$lib/features/simulator/model/player-visual-settings.js";
  import { MatchChatController } from "@/features/match-chat/match-chat-controller.svelte.js";
  import type { ChatMessage } from "@tcg/shared";
  import HumanVsAiMatchPage from "@/features/simulator-devtools/vs-ai/HumanVsAiMatchPage.svelte";
  import {
    HUMAN_VS_AI_STORAGE_KEY,
    saveHumanVsAiConfig,
    type HumanVsAiStorage,
  } from "@/features/simulator-devtools/vs-ai/storage.js";
  import type { HumanVsAiMatchConfig } from "@/features/simulator-devtools/vs-ai/types.js";
  import { OpponentPresenceTracker } from "@/features/gateway/opponent-presence.svelte.js";
  import { logOperationalEvent } from "$lib/telemetry/logs.js";

  let { data } = $props();
  const getGameId = (): string => data.gameId;
  // svelte-ignore state_referenced_locally
  const isSpectator = data.spectate;
  const aiOrchestratorContext = createHumanVsAiContext();
  const PRACTICE_HINT_DISMISSED_AT_KEY = "lorcana.practice-match.hint-dismissed-at";
  const PRACTICE_HINT_HIDE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

  let practiceOrchestrator = $state<PracticeMatchOrchestrator | null>(null);
  let loadError = $state<string | null>(null);
  let loading = $state(true);
  /** When gateway fails for a quick-match, fall back to local-only play (no replay). */
  let localFallbackStorage = $state<HumanVsAiStorage | null>(null);
  let showPracticeHint = $state(true);
  let pendingRecentHistory = $state<PracticeMatchRecentHistory | null>(null);
  // Visual settings (card back, playmat) keyed by roster id.
  // Populated from game_joined at load time. Practice may use user id as seat;
  // ranked uses gameProfileId. Server resolves when building playerVisualSettings.
  // Updates are saved via REST (PUT /v1/users/me/visual-settings), not via WebSocket.
  let playerVisualSettings = $state<LorcanaPlayerSettingsMap>({});
  let matchChatController = $state<MatchChatController | null>(null);
  const opponentPresence = new OpponentPresenceTracker();
  let ownPlayerId: string | null = null;
  let isBotMatch = $state(false);
  let opponentGameProfileId = $state<string | null>(null);
  let opponentDisplayName = $state<string | null>(null);
  let moderationMatchId = $state<string | null>(null);

  const GATEWAY_WS_URL = getGatewayWsUrl();

  let gateway = $state<GatewayClientStore | null>(null);

  async function initMatch(): Promise<void> {
    const gameId = getGameId();
    console.log("[match-page] initMatch", { gameId });

    const session = loadPracticeSession(gameId);
    if (!session) {
      console.info("[match-page] no local session, redirecting to spectator view", { gameId });
      await goto(`/spectate/${gameId}`, { replaceState: true });
      return;
    }
    isBotMatch = !!session.botPlayerId;
    moderationMatchId = session.matchId ?? null;
    console.log("[match-page] session loaded", {
      matchId: session.matchId,
      gameProfileId: session.gameProfileId,
      hasWsTicket: !!session.wsTicket,
    });

    // For quick-match sessions (guest users), fetch a fresh ticket via the
    // quick-match ticket endpoint. For authenticated sessions, use the
    // standard gateway ticket flow.
    const isQuickMatch = !!session.wsTicket;
    let ticket: string | null = null;
    let authToken: string | null = null;

    /** Fall back to local-only play for quick-match sessions when gateway is unavailable. */
    const fallbackDeckConfig = session.deckConfig;
    function fallbackToLocal(reason: string): void {
      console.warn("[match-page] falling back to local-only mode", { reason, serverGameId: getGameId() });
      const config = fallbackDeckConfig;
      // Persist to localStorage so /sandbox/simulator/vs-ai can restore on refresh
      saveHumanVsAiConfig(config);
      // Swap the URL without re-mounting so refresh lands on the vs-ai page instead of retrying the server
      history.replaceState(null, "", "/sandbox/simulator/vs-ai");
      const stored = JSON.stringify(config);
      localFallbackStorage = {
        getItem: (key: string) => (key === HUMAN_VS_AI_STORAGE_KEY ? stored : null),
        setItem: () => undefined,
        removeItem: () => undefined,
      };
    }

    if (isQuickMatch) {
      console.log("[match-page] quick-match session, fetching fresh ticket");
      const qmResult = await fetchQuickMatchTicket(session.matchId, session.gameProfileId);
      if (!qmResult) {
        console.error("[match-page] quick-match ticket failed");
        logOperationalEvent("match_join_quick_ticket_failed", { mode: "practice" }, "error");
        fallbackToLocal("Failed to fetch quick-match ticket");
        return;
      }
      console.log("[match-page] quick-match ticket received", { ticketLength: qmResult.ticket?.length });
      ticket = qmResult.ticket;
      authToken = qmResult.authToken;
    } else {
      if (!authSession.isAuthenticated) {
        console.warn("[match-page] auth required but not authenticated");
        loadError = "Authentication required. Please sign in and try again.";
        return;
      }
      const gwResult = await fetchGatewayTicket();
      if (gwResult) {
        ticket = gwResult.ticket;
        authToken = gwResult.authToken;
      }
    }

    console.log("[match-page] ticket resolved", { hasTicket: !!ticket, source: isQuickMatch ? "quick-match" : "api" });
    let gameJoinedResolve: (msg: { type: string; [key: string]: unknown }) => void;
    const gameJoinedPromise = new Promise<{ type: string; [key: string]: unknown }>((resolve) => {
      gameJoinedResolve = resolve;
    });

    let gatewayError: string | null = null;

    gateway = createGatewayStore(
      GATEWAY_WS_URL,
      ticket ?? undefined,
      (msg) => {
        console.log("[match-page] gateway message", { type: msg.type, ...("code" in msg ? { code: msg.code } : {}), ...("message" in msg ? { message: msg.message } : {}) });

        if (msg.type === "game_error" || msg.type === "error") {
          gatewayError = `${msg.code ?? "unknown"}: ${msg.message ?? "Unknown error"}`;
          console.error("[match-page] gateway game error", msg);
          logOperationalEvent(
            "match_join_gateway_game_error",
            { code: typeof msg.code === "string" ? msg.code : "unknown" },
            "error",
          );
          return;
        }

        if (msg.type === "game_joined") {
          trackEvent("game_join", { mode: isQuickMatch ? "practice" : "ranked" });
          const joinedSettings = (msg as Record<string, unknown>).playerVisualSettings as
            | LorcanaPlayerSettingsMap
            | undefined;
          if (joinedSettings) {
            playerVisualSettings = { ...joinedSettings };
          }
          gameJoinedResolve(msg);
          return;
        }

        if (msg.type === "game_recent_history") {
          const history = msg as unknown as PracticeMatchRecentHistory & { gameId: string };
          if (history.gameId !== gameId) {
            return;
          }

          if (practiceOrchestrator) {
            practiceOrchestrator.hydrateRecentHistory({
              acceptedMoves: history.acceptedMoves,
              engineLogs: history.engineLogs,
            });
          } else {
            pendingRecentHistory = {
              acceptedMoves: history.acceptedMoves,
              engineLogs: history.engineLogs,
            };
          }
        }

        if (msg.type === "game_chat_history" && matchChatController) {
          matchChatController.hydrateHistory(
            String(msg.matchId ?? ""),
            Array.isArray(msg.messages) ? (msg.messages as ChatMessage[]) : [],
            { freeTextEnabled: msg.freeTextEnabled === true },
          );
          return;
        }

        if (msg.type === "chat_message" && matchChatController && msg.message) {
          matchChatController.receiveMessage(
            String(msg.matchId ?? ""),
            msg.message as ChatMessage,
          );
        }

        if (msg.type === "match_state") {
          const participants = (msg as Record<string, unknown>).participants as
            | Array<{ id: string; displayName?: string }>
            | undefined;
          if (participants && session.gameProfileId) {
            const opp = participants.find((p) => p.id !== session.gameProfileId);
            if (opp?.displayName) {
              opponentDisplayName = opp.displayName;
            }
          }
        }

        if (msg.type === "presence_change" && ownPlayerId && !isBotMatch) {
          const playerId = String(msg.playerId ?? "");
          if (playerId && playerId !== ownPlayerId) {
            opponentPresence.handlePresenceChange(
              msg.status as "connected" | "disconnected",
              msg.disconnectedAt as string | undefined,
            );
          }
        }
      },
      undefined,
      authToken ?? undefined,
      () => authSession.session?.token,
    );
    matchChatController = new MatchChatController({
      gameId,
      canSend: true,
      sendMessage: (message) => gateway?.send(message),
    });

    const welcomePromise = new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (gateway!.connectionId) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 10_000);
    });

    console.log("[match-page] connecting gateway", { wsUrl: GATEWAY_WS_URL });
    gateway.connect();
    await welcomePromise;

    if (!gateway.connectionId) {
      console.error("[match-page] gateway connection failed", {
        wsUrl: GATEWAY_WS_URL,
        status: gateway.status,
      });
      logOperationalEvent(
        "match_join_gateway_connection_failed",
        { mode: isQuickMatch ? "practice" : "ranked", status: gateway.status },
        "error",
      );
      if (isQuickMatch) {
        fallbackToLocal("Gateway connection failed");
        return;
      }
      loadError = `Failed to connect to game server at ${GATEWAY_WS_URL}. Check that the game server is running.`;
      return;
    }

    console.log("[match-page] gateway connected", { connectionId: gateway.connectionId });
    gateway.send({ type: "join_game", gameId, role: "player" });

    const gameJoinedMsg = await Promise.race([
      gameJoinedPromise,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 10_000)),
    ]);

    if (!gameJoinedMsg) {
      const detail = gatewayError
        ? `Server responded with: ${gatewayError}`
        : `No game_joined response within 10s. Gateway authenticated: ${gateway.authenticated}, error: ${gateway.error ?? "none"}`;
      console.error("[match-page] join_game timeout", {
        gameId,
        gatewayError,
        gatewayAuthenticated: gateway.authenticated,
        gatewayStatus: gateway.status,
        gatewayStateError: gateway.error,
      });
      logOperationalEvent(
        "match_join_timeout",
        {
          mode: isQuickMatch ? "practice" : "ranked",
          authenticated: gateway.authenticated,
          gateway_status: gateway.status,
          has_gateway_error: gatewayError !== null,
        },
        "error",
      );
      if (isQuickMatch) {
        fallbackToLocal(`join_game timeout: ${detail}`);
        return;
      }
      loadError = `Timeout waiting to join game. ${detail}`;
      return;
    }

    const hasState = gameJoinedMsg.state != null;
    const deckConfig = session.deckConfig;
    const cardsMaps = gameJoinedMsg.cardsMaps as CardsMaps | undefined;

    console.log("[match-page] game_joined", {
      hasState,
      stateVersion: gameJoinedMsg.stateVersion,
      hasCardsMaps: !!cardsMaps,
      stateKeys: gameJoinedMsg.state && typeof gameJoinedMsg.state === "object"
        ? Object.keys(gameJoinedMsg.state as object)
        : [],
    });

    // Track own player ID for presence filtering
    ownPlayerId = session.gameProfileId;

    // Check initial opponent presence from game_joined (skip for bot matches — bots are never "connected")
    if (!isBotMatch) {
      const players = gameJoinedMsg.players as Array<{ id: string; connected: boolean; disconnectedAt?: string }> | undefined;
      if (players) {
        const opponent = players.find((p) => p.id !== session.gameProfileId);
        if (opponent) {
          opponentGameProfileId = opponent.id;
          if (!opponent.connected) {
            opponentPresence.handlePresenceChange("disconnected", opponent.disconnectedAt);
          }
        }
      }
    }

    if (hasState) {
      // Both practice and ranked matches now use the same flat format:
      // game_joined.state = raw LorcanaMatchState
      // game_joined.cardsMaps = CardsMaps
      if (!cardsMaps) {
        console.error("[match-page] game_joined missing cardsMaps", {
          gameId,
          stateVersion: gameJoinedMsg.stateVersion,
        });
        logOperationalEvent("match_join_missing_cards_maps", {}, "error");
        loadError = "Match state is missing card data (cardsMaps). The match may have expired.";
        return;
      }

      const restoredSnapshot: LorcanaServerAuthoritativeSnapshot = {
        state: gameJoinedMsg.state as LorcanaServerAuthoritativeSnapshot["state"],
        cardsMaps,
      };

      console.log("[match-page] restoring match from snapshot", {
        cardInstanceCount: Object.keys(cardsMaps.cardInstances).length,
        ownerCount: Object.keys(cardsMaps.owners).length,
      });

      practiceOrchestrator = await PracticeMatchOrchestrator.create({
        gameId,
        playerId: session.gameProfileId,
        botPlayerId: session.botPlayerId,
        deckConfig,
        gateway: gateway!,
        restoredSnapshot,
        restoredVersion: (gameJoinedMsg.stateVersion as number) ?? 0,
        restoredRecentHistory: pendingRecentHistory ?? undefined,
      });
      pendingRecentHistory = null;
    } else {
      console.log("[match-page] no state in game_joined, starting fresh");
      practiceOrchestrator = await PracticeMatchOrchestrator.create({
        gameId,
        playerId: session.gameProfileId,
        botPlayerId: session.botPlayerId,
        deckConfig,
        gateway: gateway!,
      });
    }

    aiOrchestratorContext.set(practiceOrchestrator.orchestrator);
  }

  function hydratePracticeHintVisibility(): void {
    const dismissedAtRaw = localStorage.getItem(PRACTICE_HINT_DISMISSED_AT_KEY);
    if (!dismissedAtRaw) {
      showPracticeHint = true;
      return;
    }

    const dismissedAt = Number.parseInt(dismissedAtRaw, 10);
    if (Number.isNaN(dismissedAt)) {
      localStorage.removeItem(PRACTICE_HINT_DISMISSED_AT_KEY);
      showPracticeHint = true;
      return;
    }

    showPracticeHint = Date.now() - dismissedAt >= PRACTICE_HINT_HIDE_DURATION_MS;
  }

  function dismissPracticeHint(): void {
    localStorage.setItem(PRACTICE_HINT_DISMISSED_AT_KEY, String(Date.now()));
    showPracticeHint = false;
  }

  function handleDropOpponent(): void {
    gateway?.send({ type: "drop_player", gameId: getGameId() });
  }

  function handleSkipOpponent(): void {
    gateway?.send({ type: "skip_opponent_turn", gameId: getGameId() });
  }

  async function handleReturnToMatchmaking(): Promise<void> {
    await practiceOrchestrator?.flushPendingState("return");
    clearPracticeSession();
    await goto("/matchmaking");
  }

  onMount(() => {
    const detachImmersive = immersiveExperience.attach();
    immersiveExperience.activateRouteChrome();
    hydratePracticeHintVisibility();

    void (async () => {
      try {
        if (isSpectator) {
          await goto(`/spectate/${getGameId()}`, { replaceState: true });
          return;
        } else {
          await initMatch();
        }
      } catch (error) {
        loadError = error instanceof Error ? error.message : "Failed to initialize match.";
      } finally {
        loading = false;
      }
    })();

    return () => {
      detachImmersive();
      immersiveExperience.deactivateRouteChrome();
    };
  });

  onDestroy(() => {
    immersiveExperience.deactivateRouteChrome();
    aiOrchestratorContext.set(null);
    practiceOrchestrator?.dispose();
    opponentPresence.dispose();
    destroyGatewayStore();
  });
</script>

<AntiRamp />
<main class="immersive-app-shell relative h-screen min-h-0 text-slate-100">
  {#if loading}
    <div class="grid h-full place-items-center px-4 text-slate-400">
      Connecting to match...
    </div>
  {:else if localFallbackStorage}
    <HumanVsAiMatchPage storage={localFallbackStorage} setupPath="/sandbox/simulator/vs-ai" serverGameId={getGameId()} />
  {:else if loadError}
    <div class="mx-auto flex h-full max-w-3xl items-center justify-center px-4 py-8">
      <Card class="w-full border-rose-400/20 bg-slate-950/88 text-slate-100">
        <CardHeader>
          <CardTitle>Match failed to load</CardTitle>
          <CardDescription class="text-rose-200">{loadError}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onclick={() => goto("/")}>Back to lobby</Button>
        </CardContent>
      </Card>
    </div>
  {:else if practiceOrchestrator}
    {#key practiceOrchestrator.orchestrator.sessionRevision}
      <LorcanaTabletopSimulator
        engine={practiceOrchestrator.currentEngine}
        readModel={practiceOrchestrator.readModel}
        playerSettings={playerVisualSettings}
        postGameGameId={getGameId()}
        isAuthenticated={authSession.isAuthenticated}
        {matchChatController}
        opponentPresence={isBotMatch ? null : opponentPresence}
        onDropOpponent={isBotMatch ? null : handleDropOpponent}
        onSkipOpponent={isBotMatch ? null : handleSkipOpponent}
        gatewayStatus={gateway?.status ?? null}
        onReturnToMatchmaking={handleReturnToMatchmaking}
        opponentGameProfileId={isBotMatch ? null : opponentGameProfileId}
        opponentDisplayName={isBotMatch ? null : opponentDisplayName}
        {moderationMatchId}
      />
    {/key}
  {/if}
</main>
