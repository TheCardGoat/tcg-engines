import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  createLorcanaClient,
  createInMemoryTransportPair,
  createPlayerId,
  getLorcanaServerAuthoritativeSnapshot,
  loadLorcanaServerAuthoritativeSnapshot,
  type LorcanaMatchState,
} from "@tcg/lorcana-engine";
import { getLorcanaCardCatalogSync } from "@tcg/lorcana-cards/cards/sync";
import { minnieMouseAlwaysClassy, liloMakingAWish } from "@tcg/lorcana-cards/cards/001";

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
