import { afterEach, describe, expect, it } from "bun:test";
import type { ServerMessage } from "@tcg/lorcana-engine";
import type { ConnectionStatus, GatewayClientStore } from "./gateway-client.svelte.js";
import { GatewayTransport, mapGatewayErrorCodeToEngineCode } from "./gateway-transport.js";
import type { AuthoritativeRecoveryTelemetryEvent } from "./gateway-transport.js";

describe("mapGatewayErrorCodeToEngineCode", () => {
  it("maps not_a_player to PLAYER_NOT_IN_MATCH", () => {
    expect(mapGatewayErrorCodeToEngineCode("not_a_player")).toBe("PLAYER_NOT_IN_MATCH");
  });

  it("maps game_not_found to MATCH_NOT_FOUND", () => {
    expect(mapGatewayErrorCodeToEngineCode("game_not_found")).toBe("MATCH_NOT_FOUND");
  });

  it("maps rejected_stale to STALE_STATE", () => {
    expect(mapGatewayErrorCodeToEngineCode("rejected_stale")).toBe("STALE_STATE");
  });

  it("maps unknown codes to INVALID_MOVE", () => {
    expect(mapGatewayErrorCodeToEngineCode("weird_code")).toBe("INVALID_MOVE");
  });
});

describe("GatewayTransport gateway errors → engine ERROR", () => {
  let inbound: ((msg: Record<string, unknown>) => void) | undefined;
  let transport: GatewayTransport;
  let received: ServerMessage[];

  const matchID = "match-1";
  const gameId = "game-1";

  afterEach(async () => {
    inbound = undefined;
    received = [];
    await transport.disconnect();
  });

  function createTransport(): void {
    received = [];
    const gateway = {
      addGameMessageListener(handler: (msg: Record<string, unknown>) => void) {
        inbound = handler;
        return () => {
          inbound = undefined;
        };
      },
      addStatusChangeListener() {
        return () => {};
      },
      send() {},
    } as unknown as GatewayClientStore;

    transport = new GatewayTransport({
      gateway,
      gameId,
      gameProfileId: "player-1",
      matchID,
    });

    transport.onMessage((m) => {
      received.push(m);
    });
  }

  it("delivers ERROR for type error with not_a_player", async () => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "error",
      code: "not_a_player",
      message: "Spectators cannot execute moves",
    });

    expect(received).toHaveLength(1);
    const m = received[0] as { type: string; code: string; message: string };
    expect(m.type).toBe("ERROR");
    expect(m.code).toBe("PLAYER_NOT_IN_MATCH");
    expect(m.message).toBe("Spectators cannot execute moves");
  });

  it("delivers ERROR for type gateway_error", async () => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "gateway_error",
      code: "internal_error",
      message: "Something broke",
    });

    expect(received).toHaveLength(1);
    const m = received[0] as { type: string; code: string };
    expect(m.type).toBe("ERROR");
    expect(m.code).toBe("INTERNAL_ERROR");
  });

  it.each([
    "drop_not_allowed",
    "player_connected",
    "too_early",
    "timeout_grace_pending",
    "disconnect_timestamp_missing",
  ])("leaves out-of-band drop error %s to the live-match router", async (code: string) => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "gateway_error",
      code,
      message: "Specific drop recovery message",
    });

    expect(received).toHaveLength(0);
  });

  it("sets resyncRequired when mapped code is STALE_STATE", async () => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "error",
      code: "rejected_stale",
      message: "Stale",
    });

    const m = received[0] as { resyncRequired?: boolean };
    expect(m.resyncRequired).toBe(true);
  });

  it("ignores error when gameId is present and mismatched", async () => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "error",
      gameId: "other-game",
      code: "not_a_player",
      message: "nope",
    });

    expect(received).toHaveLength(0);
  });
});

describe("GatewayTransport move_accepted delivers UPDATE_FULL", () => {
  let inbound: ((msg: Record<string, unknown>) => void) | undefined;
  let transport: GatewayTransport;
  let received: ServerMessage[];

  const matchID = "match-1";
  const gameId = "game-1";

  const minimalState = { ctx: { _stateID: 2, playerIds: [] as string[] } };

  afterEach(async () => {
    inbound = undefined;
    received = [];
    await transport.disconnect();
  });

  function createTransport(): void {
    received = [];
    const gateway = {
      addGameMessageListener(handler: (msg: Record<string, unknown>) => void) {
        inbound = handler;
        return () => {
          inbound = undefined;
        };
      },
      addStatusChangeListener() {
        return () => {};
      },
      send() {},
    } as unknown as GatewayClientStore;

    transport = new GatewayTransport({
      gateway,
      gameId,
      gameProfileId: "player-1",
      matchID,
    });

    transport.onMessage((m) => {
      received.push(m);
    });
  }

  it("delivers UPDATE_FULL when move_accepted carries full state", async () => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "move_accepted",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      actorId: "p1",
      state: minimalState,
      patches: [],
      animations: [],
      engineLogs: [],
    });

    expect(received).toHaveLength(1);
    const m = received[0] as {
      type: string;
      stateID: number;
      state: unknown;
      processedCommand: { commandID: string; move: string };
      animations: unknown[];
    };
    expect(m.type).toBe("UPDATE_FULL");
    expect(m.stateID).toBe(2);
    expect(m.state).toEqual(minimalState);
    expect(m.processedCommand.move).toBe("passTurn");
    expect(m.animations).toEqual([]);
  });

  it("ignores move_accepted without state", async () => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "move_accepted",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      actorId: "p1",
    });

    expect(received).toHaveLength(0);
  });

  it("delivers UPDATE_FULL for state_update", async () => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "state_update",
      gameId,
      stateVersion: 2,
      state: minimalState,
      patches: [],
    });

    expect(received).toHaveLength(1);
    const m = received[0] as { type: string; stateID: number };
    expect(m.type).toBe("UPDATE_FULL");
    expect(m.stateID).toBe(2);
  });
});

describe("GatewayTransport reconnect lifecycle", () => {
  let inbound: ((msg: Record<string, unknown>) => void) | undefined;
  let statusHandler: ((status: ConnectionStatus) => void) | undefined;
  let transport: GatewayTransport;
  let disconnects: string[];
  let sent: object[];

  const matchID = "match-1";
  const gameId = "game-1";

  afterEach(async () => {
    inbound = undefined;
    statusHandler = undefined;
    disconnects = [];
    sent = [];
    await transport.disconnect();
  });

  function createTransport(heartbeatIntervalMs?: number): void {
    disconnects = [];
    sent = [];
    const gateway = {
      addGameMessageListener(handler: (msg: Record<string, unknown>) => void) {
        inbound = handler;
        return () => {
          inbound = undefined;
        };
      },
      addStatusChangeListener(handler: (status: ConnectionStatus) => void) {
        statusHandler = handler;
        return () => {
          statusHandler = undefined;
        };
      },
      send(message: object) {
        sent.push(message);
      },
      sendWithAck() {
        return Promise.resolve({ type: "move_accepted" });
      },
    } as unknown as GatewayClientStore;

    transport = new GatewayTransport({
      gateway,
      gameId,
      gameProfileId: "player-1",
      userId: "user-1",
      matchID,
      heartbeatIntervalMs,
    });

    transport.onDisconnect((reason) => {
      disconnects.push(reason);
    });
  }

  it("treats reconnecting as a gateway drop", async () => {
    createTransport();
    await transport.connect();

    statusHandler?.("reconnecting");

    expect(transport.getState()).toBe("DISCONNECTED");
    expect(disconnects).toEqual(["gateway disconnected"]);
  });

  it("sends reconnect with the last server version after the socket returns", async () => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "state_update",
      gameId,
      stateVersion: 7,
      state: { ctx: { _stateID: 7 } },
    });
    statusHandler?.("reconnecting");
    statusHandler?.("connected");

    expect(sent).toContainEqual({
      type: "reconnect",
      gameProfileId: "player-1",
      userId: "user-1",
      gameId,
      lastReceivedVersion: 7,
    });
  });

  it("reports browser-observed heartbeat RTT samples to the game server", async () => {
    createTransport(5);
    await transport.connect();
    await new Promise((resolve) => setTimeout(resolve, 8));

    const firstHeartbeat = sent.find(
      (message): message is Record<string, unknown> =>
        (message as Record<string, unknown>).type === "heartbeat",
    );
    expect(firstHeartbeat?.correlationId).toBeString();
    expect(firstHeartbeat?.clientSentAt).toBeNumber();

    inbound?.({
      type: "heartbeat_ack",
      serverTime: new Date().toISOString(),
      stateVersions: {},
      correlationId: firstHeartbeat?.correlationId,
      clientSentAt: firstHeartbeat?.clientSentAt,
    });
    await new Promise((resolve) => setTimeout(resolve, 8));

    expect(sent).toContainEqual(
      expect.objectContaining({
        type: "heartbeat",
        previousCorrelationId: firstHeartbeat?.correlationId,
        previousRoundTripMs: expect.any(Number),
      }),
    );
  });

  it("stops reconnect and heartbeat traffic after game_not_found", async () => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "error",
      gameId,
      code: "game_not_found",
      message: `Game ${gameId} not found`,
    });

    const sentBeforeFlap = sent.length;
    statusHandler?.("reconnecting");
    statusHandler?.("connected");
    transport.requestStateSync(3);
    transport.send({
      type: "UPDATE_ACTION",
      protocolVersion: 5,
      matchID,
      prevStateID: 3,
      command: { commandID: "c1", move: "playCard", input: { args: {} } },
    } as never);

    expect(sent.length).toBe(sentBeforeFlap);
    expect(disconnects).toContain("match not found");
    expect(transport.getState()).toBe("DISCONNECTED");
  });

  it("keeps the terminal session dead after disconnect/reconnect on the same transport", async () => {
    createTransport();
    await transport.connect();

    inbound?.({
      type: "error",
      gameId,
      code: "game_not_found",
      message: `Game ${gameId} not found`,
    });

    await transport.disconnect();
    const sentAfterTerminal = sent.length;
    await transport.connect();
    transport.requestStateSync(1);
    statusHandler?.("reconnecting");
    statusHandler?.("connected");

    expect(transport.getState()).toBe("DISCONNECTED");
    expect(sent.length).toBe(sentAfterTerminal);
  });
});

describe("GatewayTransport authoritative command lifecycle", () => {
  const gameId = "game-1";
  const state = { ctx: { _stateID: 2, playerIds: [] as string[] } };
  let inbound: ((msg: Record<string, unknown>) => void) | undefined;
  let transport: GatewayTransport;
  let sent: object[];
  let submitted: object[];
  let pendingAcks: Array<{
    resolve: (value: object) => void;
    reject: (reason: string) => void;
  }>;
  let telemetry: AuthoritativeRecoveryTelemetryEvent[];

  function createTransport(recoveryTimeoutMs = 10_000): void {
    sent = [];
    submitted = [];
    pendingAcks = [];
    telemetry = [];
    const gateway = {
      addGameMessageListener(handler: (msg: Record<string, unknown>) => void) {
        inbound = handler;
        return () => {
          inbound = undefined;
        };
      },
      addStatusChangeListener() {
        return () => {};
      },
      send(message: object) {
        sent.push(message);
      },
      sendWithAck(message: object) {
        submitted.push(message);
        return new Promise<object>((resolve, reject) => {
          pendingAcks.push({ resolve, reject });
        });
      },
    } as unknown as GatewayClientStore;

    transport = new GatewayTransport({
      gateway,
      gameId,
      gameProfileId: "player-1",
      matchID: "match-1",
      recoveryTimeoutMs,
      onRecoveryTelemetry: (event) => telemetry.push(event),
    });
  }

  function sendMove(commandID = "command-1", prevStateID = 1): void {
    transport.send({
      type: "UPDATE_ACTION",
      protocolVersion: 5,
      matchID: "match-1",
      prevStateID,
      command: {
        commandID,
        move: "passTurn",
        input: { args: {} },
      },
    });
  }

  afterEach(async () => {
    await transport.disconnect();
  });

  it("locks synchronously and sends only one authoritative command", async () => {
    createTransport();
    await transport.connect();

    sendMove();
    sendMove("command-2");

    expect(submitted).toHaveLength(1);
    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({
      phase: "submitting",
      moveId: "passTurn",
      commandID: "command-1",
    });
  });

  it("unlocks after acceptance or an illegal rejection", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    inbound?.({
      type: "move_accepted",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      actorId: "player-1",
      state,
    });
    expect(transport.getAuthoritativeCommandStatus()).toEqual({ phase: "idle" });

    sendMove("command-2");
    inbound?.({
      type: "move_rejected",
      gameId,
      code: "rejected_illegal",
      reason: "That move is not legal",
    });
    expect(transport.getAuthoritativeCommandStatus()).toEqual({ phase: "idle" });
  });

  it("unlocks and reconciles the terminal board when match completion fails", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    inbound?.({
      type: "error",
      gameId,
      code: "completion_failed",
      message: "Failed to complete game",
    });

    expect(transport.getAuthoritativeCommandStatus()).toEqual({ phase: "idle" });
    expect(sent).toContainEqual({
      type: "reconnect",
      gameProfileId: "player-1",
      gameId,
      lastReceivedVersion: 0,
    });
  });

  it("unlocks from the actor state broadcast when move_accepted is lost", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    inbound?.({
      type: "state_update",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      state,
      engineLogs: [{ log: { playerId: "player-1" } }],
    });

    expect(transport.getAuthoritativeCommandStatus()).toEqual({ phase: "idle" });
  });

  it("unlocks across an engine version jump when move_accepted is lost", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    inbound?.({
      type: "state_update",
      gameId,
      stateVersion: 3,
      moveType: "passTurn",
      state: { ctx: { _stateID: 3, playerIds: [] as string[] } },
      engineLogs: [{ log: { playerId: "player-1" } }],
    });

    expect(transport.getAuthoritativeCommandStatus()).toEqual({ phase: "idle" });
  });

  it("ignores the retired acknowledgement timeout after a broadcast unlocks the command", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    inbound?.({
      type: "state_update",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      state,
      engineLogs: [{ log: { playerId: "player-1" } }],
    });
    sendMove("command-2", 2);

    pendingAcks[0]?.reject("timeout");
    await Promise.resolve();

    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({
      phase: "submitting",
      commandID: "command-2",
    });
    expect(sent).toHaveLength(0);
  });

  it("ignores a reordered acceptance for the command retired by a state broadcast", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    inbound?.({
      type: "state_update",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      state,
      engineLogs: [{ log: { playerId: "player-1" } }],
    });
    sendMove("command-2", 2);

    inbound?.({
      type: "move_accepted",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      actorId: "player-1",
      state,
    });

    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({
      phase: "submitting",
      commandID: "command-2",
    });
  });

  it("does not unlock from an opponent state broadcast", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    inbound?.({
      type: "state_update",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      state,
      engineLogs: [{ log: { playerId: "player-2" } }],
    });

    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({ phase: "submitting" });
  });

  it("does not unlock without evidence that the actor state broadcast is ours", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    inbound?.({
      type: "state_update",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      state,
      engineLogs: [],
    });

    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({ phase: "submitting" });
  });

  it("recovers when move_accepted omits the authoritative state", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    inbound?.({
      type: "move_accepted",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      actorId: "player-1",
    });

    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({
      phase: "recovering",
      recoveryCause: "delivery_unknown",
    });
    expect(sent).toContainEqual({
      type: "reconnect",
      gameProfileId: "player-1",
      gameId,
      lastReceivedVersion: 0,
    });

    inbound?.({ type: "state_sync", gameId, stateVersion: 2, state });
    expect(transport.getAuthoritativeCommandStatus()).toEqual({ phase: "idle" });
  });

  it("deduplicates stale sync and stays locked until the snapshot is applied", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    inbound?.({
      type: "move_rejected",
      gameId,
      code: "rejected_stale",
      reason: "Expected version 1 but found 2",
      currentVersion: 2,
    });
    transport.requestStateSync(2);

    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({
      phase: "recovering",
      recoveryCause: "stale_state",
    });
    expect(
      sent.filter((message) => (message as { type?: string }).type === "reconnect"),
    ).toHaveLength(1);

    inbound?.({ type: "state_sync", gameId, stateVersion: 2, state });
    expect(transport.getAuthoritativeCommandStatus()).toEqual({ phase: "idle" });
    expect(submitted).toHaveLength(1);
    expect(telemetry.map((event) => event.type)).toEqual(["started", "completed"]);
    expect(telemetry.every((event) => !("payload" in event))).toBe(true);
  });

  it("reconciles an acknowledgement timeout before retrying", async () => {
    createTransport();
    await transport.connect();
    sendMove();

    pendingAcks[0]?.reject("timeout");
    await Promise.resolve();
    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({
      phase: "recovering",
      recoveryCause: "delivery_unknown",
    });

    inbound?.({ type: "state_sync", gameId, stateVersion: 1, state });
    expect(submitted).toHaveLength(2);
    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({ phase: "submitting" });

    inbound?.({
      type: "move_accepted",
      gameId,
      stateVersion: 2,
      moveType: "passTurn",
      actorId: "player-1",
      state,
    });
    expect(transport.getAuthoritativeCommandStatus()).toEqual({ phase: "idle" });
    expect(telemetry.map((event) => event.type)).toEqual(["started", "completed"]);
  });

  it("keeps the lock after recovery timeout and supports manual retry", async () => {
    createTransport(5);
    await transport.connect();
    sendMove();
    pendingAcks[0]?.reject("timeout");
    await new Promise((resolve) => setTimeout(resolve, 15));

    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({
      phase: "recovery_failed",
      recoveryCause: "delivery_unknown",
    });

    transport.requestStateSync(1);
    expect(transport.getAuthoritativeCommandStatus()).toMatchObject({ phase: "recovering" });
    expect(
      sent.filter((message) => (message as { type?: string }).type === "reconnect"),
    ).toHaveLength(2);

    inbound?.({ type: "state_sync", gameId, stateVersion: 2, state });
    expect(transport.getAuthoritativeCommandStatus()).toEqual({ phase: "idle" });
  });

  it("cleans recovery timers and subscriptions on disposal", async () => {
    createTransport(5);
    await transport.connect();
    const statuses: string[] = [];
    transport.onAuthoritativeCommandStatusChange((status) => statuses.push(status.phase));
    sendMove();
    pendingAcks[0]?.reject("timeout");
    await Promise.resolve();

    await transport.disconnect();
    const statusCountAfterDisposal = statuses.length;
    await new Promise((resolve) => setTimeout(resolve, 15));

    expect(transport.getAuthoritativeCommandStatus()).toEqual({ phase: "idle" });
    expect(statuses).toHaveLength(statusCountAfterDisposal);
  });
});
