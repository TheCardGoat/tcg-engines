import { afterEach, describe, expect, it } from "bun:test";
import type { ServerMessage } from "@tcg/lorcana-engine";
import type { ConnectionStatus, GatewayClientStore } from "./gateway-client.svelte.js";
import { GatewayTransport, mapGatewayErrorCodeToEngineCode } from "./gateway-transport.js";

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

  function createTransport(): void {
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
});
