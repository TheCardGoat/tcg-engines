import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  createLorcanaClient,
  createInMemoryTransportPair,
  createPlayerId,
  getLorcanaServerAuthoritativeSnapshot,
  loadLorcanaServerAuthoritativeSnapshot,
  type ClientMessage,
  type LorcanaMatchState,
  type ServerMessage,
  type Transport,
  type AuthoritativeCommandStatus,
} from "@tcg/lorcana-engine";
import { getLorcanaCardCatalogSync } from "@tcg/lorcana-cards/cards/sync";
import {
  liloMakingAWish,
  minnieMouseAlwaysClassy,
  stealFromTheRich,
} from "@tcg/lorcana-cards/cards/001";
import { mauiHalfshark } from "@tcg/lorcana-cards/cards/006";

describe("Standalone LorcanaClient (no transport)", () => {
  function createTestState() {
    const inkCards = Array.from({ length: minnieMouseAlwaysClassy.cost }, () => liloMakingAWish);
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [minnieMouseAlwaysClassy], inkwell: inkCards, deck: [liloMakingAWish] },
      { deck: [liloMakingAWish] },
    );
    return {
      snapshot: getLorcanaServerAuthoritativeSnapshot(
        testEngine.asServer(),
        testEngine.getCardsMaps(),
      ),
      testEngine,
    };
  }

  it("can load state and render board without transport", () => {
    const { snapshot } = createTestState();
    const { cardsMaps, state } = snapshot;
    const matchState = state as LorcanaMatchState;
    const players = Object.keys(cardsMaps.owners).map((id) => ({ id }));

    const client = createLorcanaClient({
      seed: matchState.ctx.random.seed,
      cardsMaps,
      cardCatalog: getLorcanaCardCatalogSync(),
      players,
      playerId: String(players[0]?.id),
      role: "player",
      goingFirst: createPlayerId(String(players[0]?.id)),
    });
    client.loadState(matchState);

    const board = client.getBoard();
    expect(board).toBeDefined();
    expect(board.playerOrder.length).toBe(2);
  });

  it("cannot execute moves without transport (returns Not Connected)", () => {
    const { snapshot } = createTestState();
    const { cardsMaps, state } = snapshot;
    const matchState = state as LorcanaMatchState;
    const players = Object.keys(cardsMaps.owners).map((id) => ({ id }));

    const client = createLorcanaClient({
      seed: matchState.ctx.random.seed,
      cardsMaps,
      cardCatalog: getLorcanaCardCatalogSync(),
      players,
      playerId: String(players[0]?.id),
      role: "player",
      goingFirst: createPlayerId(String(players[0]?.id)),
    });
    client.loadState(matchState);

    const result = client.playCard(minnieMouseAlwaysClassy);
    expect(result.success).toBe(false);
  });
});

describe("LorcanaServer + connected LorcanaClient (2 instances)", () => {
  function createTestState() {
    const inkCards = Array.from({ length: minnieMouseAlwaysClassy.cost }, () => liloMakingAWish);
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [minnieMouseAlwaysClassy], inkwell: inkCards, deck: [liloMakingAWish] },
      { deck: [liloMakingAWish] },
    );
    return {
      snapshot: getLorcanaServerAuthoritativeSnapshot(
        testEngine.asServer(),
        testEngine.getCardsMaps(),
      ),
    };
  }

  it("can execute moves via connected client", () => {
    const { snapshot } = createTestState();
    const cardCatalog = getLorcanaCardCatalogSync();

    // Step 1: Restore server from snapshot
    const server = loadLorcanaServerAuthoritativeSnapshot(snapshot, cardCatalog);

    // Step 2: Create transport pair and connect
    const transport = createInMemoryTransportPair();
    const { cardsMaps, state } = snapshot;
    const matchState = state as LorcanaMatchState;
    const players = Object.keys(cardsMaps.owners).map((id) => ({ id }));
    const playerId = String(players[0]?.id);

    server.acceptConnection(playerId, transport.server);

    const client = createLorcanaClient({
      seed: matchState.ctx.random.seed,
      cardsMaps,
      cardCatalog,
      players,
      playerId,
      role: "player",
      transport: transport.client,
      goingFirst: createPlayerId(playerId),
    });
    client.connectSync();

    // Step 3: Execute a move
    const result = client.playCard(minnieMouseAlwaysClassy);
    expect(result).toBeSuccessfulCommand();

    // Step 4: Verify state changed
    const board = client.getBoard();
    expect(board).toBeDefined();
  });
});

describe("LorcanaClient with delayed authoritative updates", () => {
  it("submits one resolveBag command while waiting for the server projection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stealFromTheRich],
        inkwell: Array.from({ length: stealFromTheRich.cost }, () => liloMakingAWish),
        play: [mauiHalfshark],
        deck: [liloMakingAWish, minnieMouseAlwaysClassy],
      },
      { deck: [liloMakingAWish, minnieMouseAlwaysClassy] },
    );
    expect(
      testEngine.asPlayerOne().playCard(stealFromTheRich, {
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();

    const snapshot = getLorcanaServerAuthoritativeSnapshot(
      testEngine.asServer(),
      testEngine.getCardsMaps(),
    );
    const matchState = snapshot.state as LorcanaMatchState;
    const players = Object.keys(snapshot.cardsMaps.owners).map((id) => ({ id }));
    const playerId = String(players[0]?.id);
    const sentMessages: ClientMessage[] = [];
    let commandStatus: AuthoritativeCommandStatus = { phase: "idle" };
    let messageHandler: (message: ServerMessage) => void = () => {};

    const transport: Transport = {
      connect: async () => {},
      disconnect: async () => {},
      send: (message) => {
        sentMessages.push(message);
        if (message.type === "UPDATE_ACTION") {
          commandStatus = {
            phase: "submitting",
            moveId: message.command.move,
            commandID: message.command.commandID,
            startedAt: Date.now(),
          };
        }
        if (message.type === "SYNC_REQUEST") {
          messageHandler({
            type: "SYNC_FULL",
            protocolVersion: message.protocolVersion,
            matchID: message.matchID,
            stateID: matchState.ctx._stateID,
            canUndo: false,
            state: matchState,
          });
        }
      },
      onMessage: (handler) => {
        messageHandler = handler;
      },
      onDisconnect: () => {},
      onError: () => {},
      getState: () => "CONNECTED",
      getAuthoritativeCommandStatus: () => commandStatus,
      onAuthoritativeCommandStatusChange: () => () => {},
      requestStateSync: () => {},
    };

    const client = createLorcanaClient({
      seed: matchState.ctx.random.seed,
      cardsMaps: snapshot.cardsMaps,
      cardCatalog: getLorcanaCardCatalogSync(),
      players,
      playerId,
      role: "player",
      transport,
      goingFirst: createPlayerId(playerId),
      skipOptimisticState: true,
    });
    client.connectSync();

    const [bagEffect] = client.getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(client.resolveBag(bagEffect!.id)).toBeSuccessfulCommand();
    const duplicate = client.resolveBag(bagEffect!.id);
    expect(duplicate.success).toBe(false);

    const resolveBagMessages = sentMessages.filter(
      (message) => message.type === "UPDATE_ACTION" && message.command.move === "resolveBag",
    );
    expect(resolveBagMessages).toHaveLength(1);
    expect(client.getBagEffects()).toHaveLength(1);
  });
});
