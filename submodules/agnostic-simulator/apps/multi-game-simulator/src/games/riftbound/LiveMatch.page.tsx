import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage as ProtocolChatMessage, ChatPresetKey } from "@tcg/protocol";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import { CHAT_PRESET_KEYS, CHAT_PRESETS } from "@tcg/simulator-runtime/chat";
import {
  ChatPanel,
  SimulatorRouteStatus,
  type ChatMessage as UiChatMessage,
} from "@tcg/simulator-ui";
import { acquireRootGatewayHandle } from "../../lib/gateway/root-socket";
import { useSimulatorRoute } from "../../simulator/providers";
import { fetchRiftboundCardDefinitions } from "./catalog";
import { RiftboundTabletop } from "./RiftboundTabletop";
import { nextRiftboundGameHref } from "./navigation";
import { downloadHostedReplay, saveHostedReplayOnDevice } from "../../runtime/replayActions";
import {
  createRiftboundClientMatchStateV1,
  parseRiftboundClientSnapshotV1,
  reduceRiftboundClientMatchStateV1,
  type RiftboundClientMatchActionV1,
  type RiftboundClientMatchStateV1,
} from "./state";

export function RiftboundLiveMatchPage() {
  const route = useSimulatorRoute();
  const page = route.matchPageData;
  const snapshot = page?.game;
  const matchId = page?.match.matchId;
  const viewerId = useMemo(() => {
    return page?.viewer.role === "player" ? page.viewer.actorId : null;
  }, [page]);
  const players = useMemo(
    () =>
      page?.match.participants
        .toSorted((a, b) => a.seat - b.seat)
        .map((participant) => participant.id) ?? [],
    [page],
  );
  const initialState = parseRiftboundClientSnapshotV1(snapshot?.view)?.state ?? null;
  const [authoritative, setAuthoritative] = useState<RiftboundClientMatchStateV1 | null>(
    initialState,
  );
  const [display, setDisplay] = useState<RiftboundClientMatchStateV1 | null>(initialState);
  const [version, setVersion] = useState<number | null>(
    initialState ? (snapshot?.stateVersion ?? 0) : null,
  );
  const [pending, setPending] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  // Seed chat from the HTTP bootstrap (player sessions only) so a refresh
  // shows history immediately; the gateway `game_chat_history` reply remains
  // the authoritative hydration for spectators and reconnects.
  const [chatMessages, setChatMessages] = useState<ProtocolChatMessage[]>(() =>
    readChatMessages(page?.history.chatMessages ?? []),
  );
  const [freeTextEnabled, setFreeTextEnabled] = useState(page?.history.freeTextEnabled === true);
  const [replayStatus, setReplayStatus] = useState<string | null>(null);
  const authoritativeRef = useRef(authoritative);
  const versionRef = useRef(version);
  useEffect(() => {
    authoritativeRef.current = authoritative;
  }, [authoritative]);
  useEffect(() => {
    versionRef.current = version;
  }, [version]);

  const acceptSnapshot = useCallback((state: unknown, nextVersion: number) => {
    const restored = parseRiftboundClientSnapshotV1(state)?.state;
    if (!restored) return;
    authoritativeRef.current = restored;
    versionRef.current = nextVersion;
    setAuthoritative(restored);
    setDisplay(restored);
    setVersion(nextVersion);
    setPending(false);
    setConflict(null);
  }, []);

  useEffect(() => {
    if (!snapshot?.gameId || !viewerId || !matchId) return;
    let active = true;
    const handle = acquireRootGatewayHandle("riftbound");
    const unsubscribers = [
      handle.on("game_joined", async (payload) => {
        if (payload.gameId !== snapshot.gameId) return;
        const restored = parseRiftboundClientSnapshotV1(payload.state);
        if (restored?.state) {
          acceptSnapshot(restored.state, payload.stateVersion);
          return;
        }
        const bootstrapCardsMaps = restored?.cardsMaps ?? payload.cardsMaps;
        if (players.length === 2 && bootstrapCardsMaps) {
          try {
            const cardsMaps = bootstrapCardsMaps as CardsMaps;
            const cardDefinitions = await fetchRiftboundCardDefinitions(
              Object.values(cardsMaps.cardInstances),
            );
            if (!active || authoritativeRef.current) return;
            const created = createRiftboundClientMatchStateV1(
              players as [string, string],
              cardsMaps,
              cardDefinitions,
            );
            handle.emit(
              "push_state",
              pushPayload(
                snapshot.gameId,
                created,
                null,
                viewerId,
                { type: "initialize", actionId: crypto.randomUUID() },
                cardsMaps,
              ),
            );
            setDisplay(created);
            setPending(true);
          } catch (error) {
            setInitializationError(
              error instanceof Error ? error.message : "The Riftbound catalog could not be loaded.",
            );
          }
        }
      }),
      handle.on(
        "state_update",
        (payload) =>
          payload.gameId === snapshot.gameId && acceptSnapshot(payload.state, payload.stateVersion),
      ),
      handle.on(
        "state_sync",
        (payload) =>
          payload.gameId === snapshot.gameId && acceptSnapshot(payload.state, payload.stateVersion),
      ),
      handle.on("move_rejected", (payload) => {
        if (payload.gameId !== snapshot.gameId || payload.code !== "rejected_stale") return;
        setDisplay(authoritativeRef.current);
        setPending(false);
        setConflict("Another update won. Reloaded the latest table; retry your action.");
        handle.emit("request_game_state_sync", {
          gameId: snapshot.gameId,
          stateVersion: versionRef.current ?? undefined,
        });
      }),
      handle.on("game_ended", (payload) => {
        if (payload.gameId !== snapshot.gameId || payload.matchCompleted || !payload.nextGameId)
          return;
        window.location.href = nextRiftboundGameHref(
          window.location.href,
          matchId,
          payload.nextGameId,
        );
      }),
      handle.on("match_state", (payload) => {
        const currentGameId =
          typeof payload.currentGameId === "string" ? payload.currentGameId : null;
        if (
          payload.matchId !== matchId ||
          payload.status === "completed" ||
          !currentGameId ||
          currentGameId === snapshot.gameId
        )
          return;
        window.location.href = nextRiftboundGameHref(window.location.href, matchId, currentGameId);
      }),
      handle.on("game_chat_history", (payload) => {
        if (payload.gameId !== snapshot.gameId) return;
        setChatMessages(readChatMessages(payload.messages));
        setFreeTextEnabled(payload.freeTextEnabled);
      }),
      handle.on("chat_message", (payload) => {
        if (payload.gameId !== snapshot.gameId) return;
        const message = readChatMessage(payload.message);
        if (!message) return;
        if (message.kind === "system" && message.systemEvent === "free_text_chat_enabled") {
          setFreeTextEnabled(true);
        }
        setChatMessages((current) =>
          current.some((entry) => entry.id === message.id)
            ? current
            : current.concat(message).slice(-100),
        );
      }),
    ];
    handle.join({ gameId: snapshot.gameId });
    return () => {
      active = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      handle.leave();
      handle.release();
    };
  }, [acceptSnapshot, matchId, players, snapshot?.gameId, viewerId]);

  const dispatch = useCallback(
    (action: RiftboundClientMatchActionV1) => {
      if (!snapshot?.gameId || !viewerId || pending) return;
      const base = authoritativeRef.current;
      if (!base) return;
      const next = reduceRiftboundClientMatchStateV1(base, action);
      const expectedVersion = versionRef.current;
      const handle = acquireRootGatewayHandle("riftbound");
      setDisplay(next);
      setPending(true);
      setConflict(null);
      handle.emit(
        "push_state",
        pushPayload(snapshot.gameId, next, expectedVersion, viewerId, action),
      );
      handle.release();
    },
    [pending, snapshot?.gameId, viewerId],
  );

  if (route.error) return <SimulatorRouteStatus title="Match unavailable" message={route.error} />;
  if (!page || !snapshot)
    return (
      <SimulatorRouteStatus
        title="Loading Riftbound match"
        message="Fetching the private match context."
      />
    );
  if (page.viewer.role === "spectator" || !viewerId)
    return (
      <SimulatorRouteStatus
        title="Spectating disabled"
        message="Riftbound live matches are limited to the two seated players."
      />
    );
  if (snapshot.authority !== "client")
    return (
      <SimulatorRouteStatus
        title="Invalid match authority"
        message="Riftbound matches must be client authoritative."
      />
    );
  if (initializationError)
    return (
      <SimulatorRouteStatus title="Table initialization failed" message={initializationError} />
    );
  if (!display)
    return (
      <SimulatorRouteStatus
        title="Initializing table"
        message="Either seated player may create the first snapshot."
      />
    );
  const sendPreset = (presetKey: string) => {
    const handle = acquireRootGatewayHandle("riftbound");
    handle.emit("send_chat_message", {
      gameId: snapshot.gameId,
      presetKey: presetKey as ChatPresetKey,
    });
    handle.release();
  };
  const sendText = (text: string) => {
    const handle = acquireRootGatewayHandle("riftbound");
    handle.emit("send_free_text_chat_message", { gameId: snapshot.gameId, text });
    handle.release();
  };
  return (
    <RiftboundTabletop
      sessionKey={`riftbound:live:${snapshot.gameId}:${viewerId}`}
      state={display}
      viewerId={viewerId}
      pending={pending}
      conflict={conflict}
      onAction={dispatch}
      sidebarExtra={
        <ChatPanel
          messages={chatMessages.map((message) => toUiChatMessage(message, viewerId))}
          presets={CHAT_PRESET_KEYS.map((id) => ({ id, label: CHAT_PRESETS[id] }))}
          freeTextEnabled={freeTextEnabled}
          onSendPreset={sendPreset}
          onSendText={sendText}
          compact
        />
      }
      replayControls={
        display.terminal ? (
          <div className="riftbound-match-actions">
            <a href={`/riftbound/simulator/replay/${encodeURIComponent(snapshot.gameId)}`}>
              Watch replay
            </a>
            <button
              type="button"
              onClick={() => {
                void saveHostedReplayOnDevice("riftbound", snapshot.gameId).then(
                  () => setReplayStatus("Saved on this device. Browser storage has no set expiry."),
                  () =>
                    setReplayStatus(
                      "Could not save in browser storage. Download is still available.",
                    ),
                );
              }}
            >
              Save on this device
            </button>
            <button
              type="button"
              onClick={() => {
                void downloadHostedReplay("riftbound", snapshot.gameId).catch(() =>
                  setReplayStatus("Replay download failed."),
                );
              }}
            >
              Download replay
            </button>
            {replayStatus ? <span role="status">{replayStatus}</span> : null}
          </div>
        ) : undefined
      }
    />
  );
}

function readChatMessages(value: unknown[]): ProtocolChatMessage[] {
  return value.flatMap((entry) => {
    const message = readChatMessage(entry);
    return message ? [message] : [];
  });
}

function readChatMessage(value: unknown): ProtocolChatMessage | null {
  if (!value || typeof value !== "object") return null;
  const message = value as Partial<ProtocolChatMessage>;
  if (
    typeof message.id !== "string" ||
    typeof message.senderPlayerId !== "string" ||
    typeof message.createdAt !== "string" ||
    (message.kind !== "preset" && message.kind !== "text" && message.kind !== "system")
  ) {
    return null;
  }
  return message as ProtocolChatMessage;
}

function toUiChatMessage(message: ProtocolChatMessage, viewerId: string): UiChatMessage {
  const senderSide =
    message.kind === "system"
      ? "system"
      : message.senderPlayerId === viewerId
        ? "player"
        : "opponent";
  const text =
    message.kind === "preset"
      ? CHAT_PRESETS[message.presetKey]
      : message.kind === "text"
        ? message.text
        : message.systemEvent.replaceAll("_", " ");
  return {
    id: message.id,
    senderSide,
    senderLabel: senderSide === "system" ? "System" : senderSide === "player" ? "You" : "Rival",
    text,
    timestamp: message.createdAt,
  };
}

function pushPayload(
  gameId: string,
  state: RiftboundClientMatchStateV1,
  expectedVersion: number | null,
  actorId: string,
  action: { type: string; actionId: string },
  cardsMaps?: CardsMaps,
) {
  const nextVersion = expectedVersion === null ? 0 : expectedVersion + 1;
  return {
    gameId,
    state,
    ...(cardsMaps ? { cardsMaps } : {}),
    expectedVersion,
    version: nextVersion,
    moveType: action.type,
    actorId,
    ...(state.terminal
      ? { gameEnd: { winnerId: state.terminal.winnerId, reason: state.terminal.reason } }
      : {}),
    acceptedMove: {
      gameId,
      stateVersion: nextVersion,
      turnNumber: state.activity.length,
      actorId,
      moveId: action.actionId,
      input: action,
      processedCommand: action,
      timestamp: Date.now(),
      sourceAuthority: "client" as const,
      transitionType: "move" as const,
      newStateID: nextVersion,
    },
    engineLogs: [
      {
        gameId,
        stateVersion: nextVersion,
        timestamp: Date.now(),
        sourceAuthority: "client" as const,
        log: { action: action.type },
      },
    ],
  };
}
