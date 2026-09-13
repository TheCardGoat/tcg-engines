import { GrandArchivePreparationPage } from "./GrandArchivePreparation.page";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  GrandArchiveViewerObject,
  GrandArchiveViewerState,
  GrandArchiveViewerZone,
} from "@tcg/grand-archive-engine/simulator";
import {
  projectGrandArchiveViewerSimulator,
  type GrandArchiveViewerSimulatorProjection,
  type GrandArchiveViewerSimulatorProjectionOptions,
} from "@tcg/grand-archive-server-adapter";
import {
  EngineInteractionView,
  type EngineInteractionView as EngineInteractionViewType,
  type InteractionSubmission,
  type ChatMessage as ProtocolChatMessage,
  type ChatPresetKey,
} from "@tcg/protocol";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import {
  ChatPanel,
  SimulatorRouteStatus,
  type ChatMessage as UiChatMessage,
} from "@tcg/simulator-ui";
import { CHAT_PRESET_KEYS, CHAT_PRESETS } from "@tcg/simulator-runtime/chat";

import { acquireRootGatewayHandle } from "../../lib/gateway/root-socket";
import { useSimulatorRoute } from "../../simulator/providers";
import { grandArchiveHarnessFixture } from "./fixtureProjection";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";
import { GrandArchiveGameSummary } from "./GrandArchiveGameSummary";

const GRAND_ARCHIVE_ZONE_NAMES = [
  "main-deck",
  "material-deck",
  "hand",
  "memory",
  "graveyard",
  "banishment",
  "field",
  "effects-stack",
  "intent",
  "pantheon",
  "inner-lineage",
  "loaded",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isViewerObject(value: unknown): value is GrandArchiveViewerObject {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.incarnation === "number" &&
    typeof value.definitionId === "string" &&
    (value.activeDefinitionId === undefined || typeof value.activeDefinitionId === "string") &&
    typeof value.isToken === "boolean" &&
    typeof value.ownerId === "string" &&
    typeof value.controllerId === "string" &&
    typeof value.zone === "string" &&
    (value.facing === "face-up" || value.facing === "face-down") &&
    typeof value.name === "string" &&
    Array.isArray(value.states) &&
    isRecord(value.counters) &&
    typeof value.damage === "number"
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isCombatState(value: unknown): boolean {
  if (value === null) return true;
  return (
    isRecord(value) &&
    typeof value.attackerId === "string" &&
    typeof value.attackingPlayerId === "string" &&
    isStringArray(value.defendingPlayerIds) &&
    isStringArray(value.targetIds) &&
    isStringArray(value.retaliatorIds) &&
    isStringArray(value.weaponIds) &&
    isStringArray(value.intentIds) &&
    (value.step === "declaration" ||
      value.step === "retaliation" ||
      value.step === "damage" ||
      value.step === "end")
  );
}

function isViewerZone(value: unknown): value is GrandArchiveViewerZone {
  if (!isRecord(value)) return false;
  if (value.visibility === "hidden") {
    return (
      typeof value.count === "number" &&
      Array.isArray(value.revealedObjects) &&
      value.revealedObjects.every(isViewerObject)
    );
  }
  return (
    value.visibility === "visible" &&
    typeof value.hiddenCount === "number" &&
    Array.isArray(value.objects) &&
    value.objects.every(isViewerObject)
  );
}

function isCombatView(value: unknown): boolean {
  if (value === null) return true;
  if (
    !isRecord(value) ||
    !isCombatState(value.combat) ||
    value.combat === null ||
    typeof value.active !== "boolean" ||
    typeof value.retaliationPending !== "boolean" ||
    (value.opportunityHolderId !== null && typeof value.opportunityHolderId !== "string") ||
    (value.decision !== null &&
      (!isRecord(value.decision) ||
        typeof value.decision.playerId !== "string" ||
        typeof value.decision.kind !== "string")) ||
    !Array.isArray(value.contributions) ||
    !value.contributions.every(
      (entry) =>
        isRecord(entry) &&
        typeof entry.objectId === "string" &&
        typeof entry.amount === "number" &&
        Number.isFinite(entry.amount),
    ) ||
    !isRecord(value.damage)
  )
    return false;
  const damage = value.damage;
  if (damage.kind === "pending")
    return ["effects", "choice", "order", "replacement", "unavailable"].includes(
      String(damage.reason),
    );
  return (
    (damage.kind === "projected" || damage.kind === "dealt") &&
    Array.isArray(damage.amounts) &&
    damage.amounts.every(
      (entry) =>
        isRecord(entry) &&
        typeof entry.sourceId === "string" &&
        typeof entry.recipientId === "string" &&
        typeof entry.amount === "number" &&
        Number.isFinite(entry.amount) &&
        entry.amount >= 0,
    )
  );
}

function isGrandArchiveLiveViewerState(raw: unknown): raw is GrandArchiveViewerState {
  if (
    !isRecord(raw) ||
    raw.schemaVersion !== 1 ||
    typeof raw.stateVersion !== "number" ||
    typeof raw.selfId !== "string" ||
    (raw.pregamePlayerId !== null && typeof raw.pregamePlayerId !== "string") ||
    (raw.mode !== "standard" && raw.mode !== "draft" && raw.mode !== "pantheon") ||
    (raw.status !== "pregame" && raw.status !== "playing" && raw.status !== "finished") ||
    !isStringArray(raw.winnerIds) ||
    !isRecord(raw.gameStates) ||
    (raw.opportunityHolderId !== null && typeof raw.opportunityHolderId !== "string") ||
    (raw.decision !== null &&
      (!isRecord(raw.decision) ||
        typeof raw.decision.kind !== "string" ||
        typeof raw.decision.playerId !== "string")) ||
    !isCombatState(raw.combat) ||
    !isCombatView(raw.combatView) ||
    !isRecord(raw.turn) ||
    typeof raw.turn.number !== "number" ||
    typeof raw.turn.phase !== "string" ||
    typeof raw.turn.playerId !== "string" ||
    !Array.isArray(raw.stack) ||
    !Array.isArray(raw.players)
  ) {
    return false;
  }
  const playersAreValid = raw.players.every((player) => {
    if (
      !isRecord(player) ||
      typeof player.id !== "string" ||
      typeof player.name !== "string" ||
      typeof player.turnOrder !== "number" ||
      typeof player.lost !== "boolean" ||
      typeof player.conceded !== "boolean" ||
      !isRecord(player.zones)
    ) {
      return false;
    }
    const zones = player.zones;
    return GRAND_ARCHIVE_ZONE_NAMES.every((zoneName) => isViewerZone(zones[zoneName]));
  });
  return playersAreValid;
}

export function parseGrandArchiveLiveViewerState(raw: unknown): GrandArchiveViewerState | null {
  return isGrandArchiveLiveViewerState(raw) ? raw : null;
}

function parseInteractionView(raw: unknown): EngineInteractionViewType | null {
  const parsed = EngineInteractionView.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

function parseAuthorizedCards(raw: unknown): Readonly<Record<string, string>> {
  if (!isRecord(raw) || !isRecord(raw.authorizedCardDefinitionIds)) return {};
  return Object.fromEntries(
    Object.entries(raw.authorizedCardDefinitionIds).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

function parseAuthorizedCardOwners(raw: unknown): Readonly<Record<string, string>> {
  if (!isRecord(raw) || !isRecord(raw.authorizedCardOwnerIds)) return {};
  return Object.fromEntries(
    Object.entries(raw.authorizedCardOwnerIds).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

interface AuthorizedCardResources {
  readonly definitionIds: Readonly<Record<string, string>>;
  readonly ownerIds: Readonly<Record<string, string>>;
  readonly names: Readonly<Record<string, string>>;
  readonly commandNamesByActionId: Readonly<Record<string, string>>;
}

function parseAuthorizedCardResources(raw: unknown): AuthorizedCardResources {
  return {
    definitionIds: parseAuthorizedCards(raw),
    ownerIds: parseAuthorizedCardOwners(raw),
    names:
      isRecord(raw) && isRecord(raw.authorizedCardNames)
        ? Object.fromEntries(
            Object.entries(raw.authorizedCardNames).filter(
              (entry): entry is [string, string] => typeof entry[1] === "string",
            ),
          )
        : {},
    commandNamesByActionId:
      isRecord(raw) && isRecord(raw.interactionCommandNamesByActionId)
        ? Object.fromEntries(
            Object.entries(raw.interactionCommandNamesByActionId).filter(
              (entry): entry is [string, string] => typeof entry[1] === "string",
            ),
          )
        : {},
  };
}

export function eventEntriesFromEngineLogs(raw: unknown): readonly SimulatorEventLogEntry[] {
  if (!Array.isArray(raw)) return [];
  const entries: SimulatorEventLogEntry[] = [];
  let eventTurn = 0;
  let eventTurnOwnerId: string | undefined;
  raw.forEach((record, recordIndex) => {
    const envelope = isRecord(record) && isRecord(record.log) ? record.log : record;
    if (!isRecord(envelope) || !Array.isArray(envelope.public)) return;
    if (typeof envelope.turnNumber === "number" && envelope.turnNumber !== eventTurn) {
      eventTurn = envelope.turnNumber;
      eventTurnOwnerId = undefined;
    }
    envelope.public.forEach((message, messageIndex) => {
      if (!isRecord(message) || typeof message.defaultMessage !== "string") return;
      const values = isRecord(message.values) ? message.values : {};
      if (
        message.key === "grand-archive.turn.started" &&
        typeof values.turnNumber === "number" &&
        typeof values.playerId === "string"
      ) {
        eventTurn = values.turnNumber;
        eventTurnOwnerId = values.playerId;
      }
      const actorSeatId =
        typeof values.playerId === "string"
          ? values.playerId
          : typeof envelope.playerId === "string"
            ? envelope.playerId
            : undefined;
      const tag =
        message.category === "combat"
          ? "combat"
          : message.category === "system"
            ? "system"
            : message.category === "ability"
              ? "ability"
              : "move";
      entries.push({
        id:
          typeof message.eventId === "string"
            ? message.eventId
            : `grand-archive-live-log:${recordIndex}:${messageIndex}`,
        turn: eventTurn,
        phase: "live",
        ...(actorSeatId ? { seatId: actorSeatId } : {}),
        timestamp: `T${String(recordIndex + 1).padStart(4, "0")}`,
        message: message.defaultMessage,
        ...(typeof message.key === "string" ? { sourceKey: message.key } : {}),
        section: {
          id: `turn:${eventTurn}`,
          label: eventTurn === 0 ? "Pregame" : `Turn ${eventTurn}`,
          ...(eventTurnOwnerId ? { actorSeatId: eventTurnOwnerId } : {}),
        },
        tags: [tag],
      });
    });
  });
  return entries;
}

export function appendEngineLogs(
  current: readonly unknown[],
  incoming: unknown,
): readonly unknown[] {
  if (!Array.isArray(incoming) || incoming.length === 0) return current;
  const combined = [...current, ...incoming];
  const seen = new Set<string>();
  return combined.filter((record, index) => {
    const stateVersion =
      isRecord(record) && typeof record.stateVersion === "number" ? record.stateVersion : "unknown";
    const timestamp =
      isRecord(record) && typeof record.timestamp === "number" ? record.timestamp : index;
    const payload = isRecord(record)
      ? JSON.stringify(record.log ?? record)
      : JSON.stringify(record);
    const key = `${stateVersion}:${timestamp}:${payload}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function grandArchiveNextGameHref(matchId: string, nextGameId: string): string {
  return `/grand-archive/simulator/matches/${encodeURIComponent(matchId)}/games/${encodeURIComponent(nextGameId)}`;
}

function readChatMessage(value: unknown): ProtocolChatMessage | null {
  if (!isRecord(value)) return null;
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

function readChatMessages(value: readonly unknown[]): ProtocolChatMessage[] {
  return value.flatMap((entry) => {
    const parsed = readChatMessage(entry);
    return parsed ? [parsed] : [];
  });
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

/** Server-authoritative Grand Archive match; the browser submits interactions only. */
export function GrandArchiveLiveMatchPage() {
  const route = useSimulatorRoute();
  if (route.error) return <SimulatorRouteStatus title="Match unavailable" message={route.error} />;
  const session = route.session;
  if (!session) return <GrandArchiveLiveGamePage />;
  switch (session.phase) {
    case "preparation":
      return <GrandArchivePreparationPage session={session} />;
    case "starting":
      return (
        <SimulatorRouteStatus
          title="Starting match"
          message="Waiting for preparation to finish. The game will appear automatically."
        />
      );
    case "cancelled":
      return <SimulatorRouteStatus title="Match cancelled" message={session.reason} />;
    case "playing":
    case "finished":
      return <GrandArchiveLiveGamePage key={session.game.gameId} />;
    default: {
      const exhaustive: never = session;
      throw new Error(`Unsupported session: ${String(exhaustive)}`);
    }
  }
}
function GrandArchiveLiveGamePage() {
  const route = useSimulatorRoute();
  const bootstrap = route.matchPageData;
  const gameId = bootstrap?.game.gameId;
  const viewerId = bootstrap?.viewer.role === "player" ? bootstrap.viewer.actorId : null;
  const [state, setState] = useState<GrandArchiveViewerState | null>(() =>
    parseGrandArchiveLiveViewerState(bootstrap?.game.view),
  );
  const [interactionView, setInteractionView] = useState<EngineInteractionViewType | null>(() =>
    parseInteractionView(bootstrap?.game.interactionView),
  );
  const [authorizedCards, setAuthorizedCards] = useState<AuthorizedCardResources>(() =>
    parseAuthorizedCardResources(bootstrap?.game.resources),
  );
  const [engineLogs, setEngineLogs] = useState<readonly unknown[]>(
    () => bootstrap?.history.engineLogs.map((entry) => entry.data) ?? [],
  );
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<ProtocolChatMessage[]>(() =>
    readChatMessages(bootstrap?.history.chatMessages ?? []),
  );
  const [freeTextEnabled, setFreeTextEnabled] = useState(
    bootstrap?.history.freeTextEnabled ?? false,
  );
  const [canUndo, setCanUndo] = useState(bootstrap?.game.undoable === true);
  const [playerConnections, setPlayerConnections] = useState<Readonly<Record<string, boolean>>>(
    () =>
      Object.fromEntries(
        (bootstrap?.presence.players ?? []).map((player) => [player.id, player.connected]),
      ),
  );
  const interactionRef = useRef(interactionView);
  const gatewayHandleRef = useRef<ReturnType<typeof acquireRootGatewayHandle> | null>(null);
  const [gatewayAttached, setGatewayAttached] = useState(false);

  useEffect(() => {
    interactionRef.current = interactionView;
  }, [interactionView]);

  useEffect(() => {
    if (!gameId || !viewerId) return;
    const handle = acquireRootGatewayHandle("grand-archive");
    gatewayHandleRef.current = handle;
    const accept = (payload: {
      readonly gameId: string;
      readonly state?: unknown;
      readonly interactionView?: unknown;
      readonly resources?: unknown;
      readonly cardsMaps?: unknown;
      readonly engineLogs?: unknown;
      readonly matchInfo?: { readonly nextGameId?: string };
      readonly undoable?: boolean;
      readonly players?: readonly { readonly id: string; readonly connected: boolean }[];
    }) => {
      if (payload.gameId !== gameId) return;
      if (payload.players) {
        setPlayerConnections(
          Object.fromEntries(payload.players.map((player) => [player.id, player.connected])),
        );
      }
      const nextState = parseGrandArchiveLiveViewerState(payload.state);
      if (nextState) setState(nextState);
      const nextInteraction = parseInteractionView(payload.interactionView);
      if (nextInteraction) setInteractionView(nextInteraction);
      else if (nextState) setInteractionView(null);
      if (typeof payload.undoable === "boolean") setCanUndo(payload.undoable);
      if (payload.resources !== undefined) {
        setAuthorizedCards(parseAuthorizedCardResources(payload.resources));
      } else if (payload.cardsMaps !== undefined) {
        setAuthorizedCards(parseAuthorizedCardResources(payload.cardsMaps));
      } else if (nextState) {
        setAuthorizedCards(parseAuthorizedCardResources(undefined));
      }
      setEngineLogs((current) => appendEngineLogs(current, payload.engineLogs));
      if (payload.matchInfo?.nextGameId && bootstrap?.match.matchId) {
        window.location.assign(
          grandArchiveNextGameHref(bootstrap.match.matchId, payload.matchInfo.nextGameId),
        );
      }
    };
    const unsubscribers = [
      handle.onDisconnected(() => setGatewayAttached(false)),
      handle.on("game_joined", (payload) => {
        accept(payload);
        if (payload.gameId === gameId) setGatewayAttached(true);
      }),
      handle.on("state_sync", accept),
      handle.on("state_update", accept),
      handle.on("move_accepted", accept),
      handle.on("game_recent_history", (payload) => {
        if (payload.gameId !== gameId) return;
        setEngineLogs((current) => appendEngineLogs(current, payload.engineLogs));
      }),
      handle.on("presence_change", (payload) => {
        if (payload.gameId !== gameId) return;
        setPlayerConnections((current) => ({
          ...current,
          [payload.playerId]: payload.status === "connected",
        }));
      }),
      handle.on("game_ended", (payload) => {
        if (payload.gameId !== gameId || !payload.nextGameId || !bootstrap?.match.matchId) {
          return;
        }
        window.location.assign(
          grandArchiveNextGameHref(bootstrap.match.matchId, payload.nextGameId),
        );
      }),
      handle.on("move_rejected", (payload) => {
        if (payload.gameId !== gameId) return;
        setConnectionError(payload.reason);
        handle.emit("request_game_state_sync", { gameId });
      }),
      handle.on("submit_interaction:response", (payload) => {
        if (payload.status === "err") {
          setConnectionError(payload.data.reason);
          handle.emit("request_game_state_sync", { gameId });
        }
      }),
      handle.on("game_chat_history", (payload) => {
        if (payload.gameId !== gameId) return;
        setChatMessages(readChatMessages(payload.messages));
        setFreeTextEnabled(payload.freeTextEnabled);
      }),
      handle.on("chat_message", (payload) => {
        if (payload.gameId !== gameId) return;
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
    handle.join({ gameId });
    return () => {
      setGatewayAttached(false);
      if (gatewayHandleRef.current === handle) gatewayHandleRef.current = null;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      handle.leave();
      handle.release();
    };
  }, [bootstrap?.match.matchId, gameId, viewerId]);

  const submitInteraction = useCallback(
    (submission: InteractionSubmission) => {
      if (!gameId || !viewerId) return false;
      const handle = gatewayHandleRef.current;
      if (!handle) return false;
      setConnectionError(null);
      handle.emit("submit_interaction", {
        gameId,
        expectedVersion: submission.stateVersion,
        submission,
        correlationId: crypto.randomUUID(),
      });
      // Mark the send as submitted to prevent draft auto-submission from repeating it.
      // An asynchronous rejection exposes the explicit retry path.
      return true;
    },
    [gameId, viewerId],
  );

  const projectionOptions = useMemo<GrandArchiveViewerSimulatorProjectionOptions>(
    () => ({
      ...(interactionView ? { interactionView } : {}),
      authorizedCardDefinitionIds: authorizedCards.definitionIds,
      authorizedCardOwnerIds: authorizedCards.ownerIds,
      authorizedCardNames: authorizedCards.names,
      interactionCommandNamesByActionId: authorizedCards.commandNamesByActionId,
      eventLog: eventEntriesFromEngineLogs(engineLogs),
    }),
    [authorizedCards, engineLogs, interactionView],
  );

  if (route.error) return <SimulatorRouteStatus title="Match unavailable" message={route.error} />;
  if (bootstrap?.viewer.role === "spectator") {
    return (
      <SimulatorRouteStatus
        title="Spectating unavailable"
        message="Grand Archive matches currently support seated players only."
      />
    );
  }
  if (!bootstrap || !gameId || !viewerId || !state) {
    return (
      <SimulatorRouteStatus
        title="Loading Grand Archive match"
        message="Connecting to the authoritative match server."
      />
    );
  }

  const projected = projectGrandArchiveViewerSimulator(state, projectionOptions);
  const projection: GrandArchiveViewerSimulatorProjection = {
    ...projected,
    table: {
      ...projected.table,
      seats: projected.table.seats.map((seat) => {
        const participant = bootstrap.match.participants.find(
          (candidate) => candidate.id === seat.id,
        );
        return {
          ...seat,
          label: participant?.displayName ?? seat.label,
          role: participant?.isBot ? ("agent" as const) : ("human" as const),
          ...(seat.id in playerConnections
            ? {
                connectionStatus: playerConnections[seat.id]
                  ? ("online" as const)
                  : ("offline" as const),
              }
            : {}),
        };
      }),
    },
  };
  const fixture = grandArchiveHarnessFixture(
    `live:${gameId}`,
    "Hosted match",
    connectionError ??
      `Playing as ${state.players.find((player) => player.id === viewerId)?.name ?? viewerId}.`,
    projection,
  );
  const sendPreset = (presetKey: string) => {
    const handle = gatewayHandleRef.current;
    if (!handle) return;
    handle.emit("send_chat_message", { gameId, presetKey: presetKey as ChatPresetKey });
  };
  const sendText = (text: string) => {
    const handle = gatewayHandleRef.current;
    if (!handle) return;
    handle.emit("send_free_text_chat_message", { gameId, text });
  };

  return (
    <>
      <GrandArchiveTabletop
        fixture={fixture}
        canUndo={canUndo}
        canConcede={bootstrap.capabilities.conceding}
        onUndo={() => {
          const handle = gatewayHandleRef.current;
          if (!handle) return;
          setConnectionError(null);
          handle.emit("execute_move", {
            gameId,
            expectedVersion: state.stateVersion,
            moveType: "undo",
            payload: {},
            correlationId: crypto.randomUUID(),
          });
        }}
        chat={
          <ChatPanel
            messages={chatMessages.map((message) => toUiChatMessage(message, viewerId))}
            presets={CHAT_PRESET_KEYS.map((id) => ({ id, label: CHAT_PRESETS[id] }))}
            canSend={bootstrap.viewer.permissions.chat}
            freeTextEnabled={freeTextEnabled}
            onSendPreset={sendPreset}
            onSendText={sendText}
            compact
          />
        }
        errorMessage={connectionError ?? undefined}
        onSubmitProtocolInteraction={gatewayAttached ? submitInteraction : undefined}
      />
      {state.status === "finished" && summaryOpen ? (
        <GrandArchiveGameSummary
          viewerId={viewerId}
          winnerIds={state.winnerIds}
          participantLabel={(playerId) =>
            bootstrap.match.participants.find((participant) => participant.id === playerId)
              ?.displayName ??
            state.players.find((player) => player.id === playerId)?.name ??
            playerId
          }
          onInspectBoard={() => setSummaryOpen(false)}
          onMainMenu={() => window.location.assign("/grand-archive/simulator")}
        />
      ) : null}
    </>
  );
}
