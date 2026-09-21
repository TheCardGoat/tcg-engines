import type { ServerWebSocket } from "bun";
import { inputAllowsOmission } from "@tcg/protocol/interactions";
import {
  NativeClientMessage,
  NativeServerMessage,
  NATIVE_LIMITS,
  type NativeActionResult,
} from "@tcg/protocol/native";
import {
  grandArchiveServerAdapter,
  GrandArchiveServerEngine,
  fingerprintGrandArchiveValue,
  grandArchiveCommandIncarnations,
} from "@tcg/grand-archive-server-adapter";
import {
  projectGrandArchiveNative,
  projectGrandArchiveNativeAnimation,
} from "@tcg/grand-archive-server-adapter/native";
import { grandArchivePracticeDecks } from "@tcg/grand-archive-server-adapter/practice";
import { grandArchiveCards } from "@tcg/grand-archive-cards";
import {
  grandArchivePlayerId,
  createGrandArchiveMatchProgram,
} from "@tcg/grand-archive-engine/runtime";
import {
  chooseGrandArchiveAutomatedAction,
  championProfileGrandArchiveStrategy,
  passOnlyGrandArchiveStrategy,
  resolveGrandArchiveTextDeck,
} from "@tcg/grand-archive-engine/automation";

type Session = { id: string; actorId: string; credential: string; sequence: number };
type SocketData = {
  session?: Session;
  joined: boolean;
  pending: number;
  windowStart: number;
  received: number;
};
const supportedInputs = ["entity-selection", "option-selection", "boolean", "number"];

/** One local game, two fixed seats, memory-only result retention. No deployed dependencies. */
export function startNativeHost(
  options: {
    port?: number;
    opponent?: "champion-profile" | "pass-only";
    opponentDelayMs?: number;
    testSeed?: string;
    testOutputBytes?: number;
    testResultLimit?: number;
  } = {},
) {
  const validateDeckForFormat =
    grandArchiveServerAdapter.validateDeckForFormat?.bind(grandArchiveServerAdapter);
  const createServerEngine =
    grandArchiveServerAdapter.createServerEngine?.bind(grandArchiveServerAdapter);
  if (!validateDeckForFormat || !createServerEngine) {
    throw new Error("Native practice requires adapter deck validation and server engine creation.");
  }
  const adapter = { validateDeckForFormat, createServerEngine };
  const outputBytes = Math.max(
    1,
    Math.min(options.testOutputBytes ?? NATIVE_LIMITS.outputBytes, NATIVE_LIMITS.outputBytes),
  );
  const resultLimit = Math.max(
    1,
    Math.min(options.testResultLimit ?? NATIVE_LIMITS.results, NATIVE_LIMITS.results),
  );
  const sessions: Session[] = ["p1", "p2"].map((actorId) => ({
    actorId,
    id: crypto.randomUUID(),
    credential: crypto.randomUUID(),
    sequence: 0,
  }));
  const sockets = new Set<ServerWebSocket<SocketData>>();
  const results = new Map<string, { fingerprint: string; result: NativeActionResult }>();
  let engine: GrandArchiveServerEngine | undefined;
  let gameId = "";
  let matchId = "";
  let queue = Promise.resolve();
  let pending = 0;
  let opponentStopped = false;
  let stopping = false;
  let botTimer: ReturnType<typeof setTimeout> | undefined;

  function send(socket: ServerWebSocket<SocketData>, message: NativeServerMessage) {
    sendValidated(socket, NativeServerMessage.parse(message));
  }
  function sendValidated(socket: ServerWebSocket<SocketData>, message: NativeServerMessage) {
    const data = JSON.stringify(message);
    if (Buffer.byteLength(data) > outputBytes || socket.getBufferedAmount() > outputBytes) {
      socket.close(1009, "output_limit");
      return;
    }
    if (socket.send(data) === -1) socket.close(1013, "slow_client");
  }
  function error(socket: ServerWebSocket<SocketData>, code: string) {
    send(socket, { v: 1, type: "error", code });
  }
  function snapshot(socket: ServerWebSocket<SocketData>) {
    const session = socket.data.session;
    if (!session || !engine) return;
    const view = projectGrandArchiveNative(engine, session.actorId);
    sendValidated(
      socket,
      NativeServerMessage.parse({
        v: 1,
        type: "state_sync",
        gameId,
        matchId,
        sequence: ++session.sequence,
        stateVersion: engine.getStateID(),
        ...view,
      }),
    );
  }
  async function handle(socket: ServerWebSocket<SocketData>, message: NativeClientMessage) {
    if (message.type === "hello") {
      if (socket.data.session) return error(socket, "already_authenticated");
      const session = sessions.find((session) => session.credential === message.credential);
      if (!session || (options.opponent && session.actorId === "p2"))
        return error(socket, "unauthorized");
      socket.data.session = session;
      send(socket, {
        v: 1,
        type: "welcome",
        sessionId: session.id,
        role: session.actorId,
        heartbeatMs: 15000,
        fixtures: grandArchivePracticeDecks.map(({ id, name }) => ({ id, name })),
        supportedInputs,
      });
      return;
    }
    const session = socket.data.session;
    if (!session) return error(socket, "unauthorized");
    if (message.type === "ping") {
      send(socket, { v: 1, type: "pong", nonce: message.nonce });
      return;
    }
    if (message.type === "pong") return;
    if (message.type === "join_game") {
      if (message.fixtureIds) {
        if (session.actorId !== "p1") return error(socket, "forbidden");
        if (engine) return error(socket, "game_already_exists");
        const fixtures = message.fixtureIds.map((id) =>
          grandArchivePracticeDecks.find((deck) => deck.id === id),
        );
        if (fixtures.some((fixture) => !fixture)) return error(socket, "unknown_fixture");
        const program = createGrandArchiveMatchProgram(grandArchiveCards);
        const decks = fixtures.map((fixture, i) => {
          if (!fixture) throw new Error("Unknown fixture");
          const resolved = resolveGrandArchiveTextDeck(program, fixture.deck);
          const deck = [
            ...resolved.mainDeck.map((entry) => ({
              cardId: entry.definitionId,
              qty: entry.count,
              sectionId: "main",
            })),
            ...resolved.materialDeck.map((entry) => ({
              cardId: entry.definitionId,
              qty: entry.count,
              sectionId: "material",
            })),
          ];
          const validation = adapter.validateDeckForFormat(
            "standard",
            deck.map((entry) => ({ ...entry, quantity: entry.qty })),
          );
          if (!validation.valid) throw new Error("Invalid starter deck");
          return { owner: sessions[i]!.actorId, deck };
        });
        const created = await adapter.createServerEngine({
          gameSlug: "grand-archive",
          seed: options.testSeed ?? crypto.randomUUID(),
          player1Id: "p1",
          player2Id: "p2",
          cardsMaps: grandArchiveServerAdapter.buildCardInstances(decks),
          timeControl: { mode: "none" },
        });
        if (!(created instanceof GrandArchiveServerEngine)) throw new Error("Unexpected engine");
        engine = created;
        gameId = crypto.randomUUID();
        matchId = crypto.randomUUID();
      } else if (!engine || message.gameId !== gameId) return error(socket, "unknown_game");
      socket.data.joined = true;
      snapshot(socket);
      return;
    }
    if (!engine || message.gameId !== gameId || !socket.data.joined)
      return error(socket, "not_joined");
    if (message.type === "request_game_state_sync") {
      snapshot(socket);
      return;
    }
    const key = `${session.id}:${gameId}:${message.correlationId}`;
    const fingerprint = fingerprintGrandArchiveValue(message);
    const previous = results.get(key);
    if (previous) {
      if (previous.fingerprint !== fingerprint) return error(socket, "correlation_conflict");
      send(socket, previous.result);
      return;
    }
    if (results.size >= resultLimit) return error(socket, "session_capacity");
    const previousVersion = engine.getStateID();
    const eventOffset = engine.runtime.state.eventHistory.length;
    const before = sessions.map((session) => projectGrandArchiveNative(engine!, session.actorId));
    const action = engine
      .getInteractionView(session.actorId)
      .actions.find((action) => action.id === message.submission.actionId);
    const unsupported =
      message.submission.automation ||
      action?.inputs.some(
        (input) =>
          !supportedInputs.includes(input.kind) &&
          (message.submission.values[input.id] != null ||
            !inputAllowsOmission(input, message.submission.values)),
      );
    const outcome = unsupported
      ? { success: false, errorCode: "unsupported_interaction" }
      : engine.submitInteraction(
          session.actorId,
          { ...message.submission, correlationId: `${session.actorId}:${message.correlationId}` },
          { gameId, sourceAuthority: "server" },
        );
    const result: NativeActionResult = {
      v: 1,
      type: "action_result",
      gameId,
      correlationId: message.correlationId,
      accepted: outcome.success,
      stateVersion: engine.getStateID(),
      code: outcome.success ? "accepted" : (outcome.errorCode ?? "rejected"),
    };
    results.set(key, { fingerprint, result });
    send(socket, result);
    if (outcome.success) publish(previousVersion, eventOffset, before);
  }
  function publish(
    previousVersion: number,
    eventOffset: number,
    before: ReturnType<typeof projectGrandArchiveNative>[],
  ) {
    if (!engine) return;
    for (const [index, viewer] of sessions.entries()) {
      const after = projectGrandArchiveNative(engine, viewer.actorId);
      const update = NativeServerMessage.parse({
        v: 1,
        type: "state_update",
        gameId,
        matchId,
        previousVersion,
        stateVersion: engine.getStateID(),
        sequence: ++viewer.sequence,
        ...after,
        animation: projectGrandArchiveNativeAnimation(engine, before[index]!, after, eventOffset),
      });
      for (const connection of sockets)
        if (connection.data.joined && connection.data.session === viewer)
          sendValidated(connection, update);
    }
  }
  function scheduleOpponent() {
    if (
      !options.opponent ||
      opponentStopped ||
      stopping ||
      botTimer ||
      !engine ||
      engine.hasGameEnded() ||
      engine.getActivePlayerId() !== "p2"
    )
      return;
    botTimer = setTimeout(() => {
      botTimer = undefined;
      if (stopping) return;
      queue = queue
        .then(() => {
          if (!engine || engine.hasGameEnded() || engine.getActivePlayerId() !== "p2") return;
          if (engine.replayJournal.commands.length >= resultLimit) {
            opponentStopped = true;
            for (const socket of sockets) error(socket, "session_capacity");
            return;
          }
          const legal = chooseGrandArchiveAutomatedAction(
            engine.program,
            engine.runtime.state,
            grandArchivePlayerId("p2"),
            options.opponent === "pass-only"
              ? passOnlyGrandArchiveStrategy
              : championProfileGrandArchiveStrategy,
          );
          if (!legal) {
            opponentStopped = true;
            for (const socket of sockets) error(socket, "opponent_no_legal_action");
            return;
          }
          const before = sessions.map((session) =>
            projectGrandArchiveNative(engine!, session.actorId),
          );
          const version = engine.getStateID();
          const offset = engine.runtime.state.eventHistory.length;
          const { move, ...payload } = legal.command;
          const result = engine.dispatch(
            move,
            "p2",
            {
              ...payload,
              expectedStateVersion: legal.stateVersion,
              objectIncarnations: grandArchiveCommandIncarnations(engine.runtime, legal.command),
            },
            { gameId, sourceAuthority: "server" },
          );
          if (result.success) publish(version, offset, before);
          else {
            opponentStopped = true;
            for (const socket of sockets) error(socket, "opponent_action_rejected");
          }
        })
        .catch(() => {
          opponentStopped = true;
          for (const socket of sockets) error(socket, "opponent_error");
        })
        .finally(scheduleOpponent);
    }, options.opponentDelayMs ?? 700);
  }

  const server = Bun.serve<SocketData>({
    hostname: "127.0.0.1",
    port: options.port ?? 0,
    fetch(request, server) {
      if (stopping) return new Response("Stopping", { status: 503 });
      // Browser origins are excluded; credentials are distributed through local terminal only.
      if (new URL(request.url).pathname !== "/native" || request.headers.has("origin"))
        return new Response("Not found", { status: 404 });
      if (sockets.size >= NATIVE_LIMITS.connections)
        return new Response("Connection limit", { status: 503 });
      if (
        server.upgrade(request, {
          data: { joined: false, pending: 0, windowStart: Date.now(), received: 0 },
        })
      )
        return;
      return new Response("WebSocket required", { status: 426 });
    },
    websocket: {
      maxPayloadLength: NATIVE_LIMITS.inputBytes,
      backpressureLimit: outputBytes,
      closeOnBackpressureLimit: true,
      idleTimeout: 60,
      open(socket) {
        sockets.add(socket);
      },
      close(socket) {
        sockets.delete(socket);
      },
      message(socket, raw) {
        if (stopping) {
          socket.close(1001, "stopping");
          return;
        }
        if (Date.now() - socket.data.windowStart >= 1000) {
          socket.data.windowStart = Date.now();
          socket.data.received = 0;
        }
        if (++socket.data.received > 64) {
          error(socket, "rate_limited");
          return;
        }
        if (typeof raw !== "string" || Buffer.byteLength(raw) > NATIVE_LIMITS.inputBytes) {
          error(socket, "invalid_frame");
          return;
        }
        let decoded: unknown;
        try {
          decoded = JSON.parse(raw);
        } catch {
          error(socket, "malformed_json");
          return;
        }
        const parsed = NativeClientMessage.safeParse(decoded);
        if (!parsed.success) {
          error(socket, "unsupported_or_malformed_message");
          return;
        }
        if (pending >= NATIVE_LIMITS.queue || socket.data.pending >= 8) {
          error(socket, "queue_full");
          return;
        }
        pending++;
        socket.data.pending++;
        queue = queue
          .then(async () => {
            // Yield to socket ingress between commands; the bounded queue applies backpressure.
            await new Promise<void>((resolve) => setImmediate(resolve));
            await handle(socket, parsed.data);
          })
          .catch(() => {
            error(socket, "internal_error");
          })
          .finally(() => {
            pending--;
            socket.data.pending--;
            scheduleOpponent();
          });
      },
    },
  });
  return {
    url: `ws://127.0.0.1:${server.port}/native`,
    sessions,
    get engine() {
      return engine;
    },
    async stop() {
      stopping = true;
      if (botTimer) clearTimeout(botTimer);
      await queue;
      for (const socket of sockets) socket.terminate();
      // Bun 1.3.13 can leave its completion promise pending after a size-limit close.
      // stop(true) synchronously stops admission/listening and terminates connections.
      // The socket test verifies that the endpoint is unreachable after this returns.
      void server.stop(true);
    },
  };
}
