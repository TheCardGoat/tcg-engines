import { describe, expect, it, vi } from "vitest";
import { AIPlayer, createPlayerId, isTacticalAIStrategy } from "@tcg/cyberpunk-engine";

import { createPracticeAiConfig, createPracticeEngine } from "./practiceEngine";
import { createImportedPracticeMatchConfig, createPracticeMatchConfig } from "./sessionStorage";
import { DEFAULT_BOT_PRACTICE_DECK_ID, getPracticeDeckFixture } from "./deckFixtures";
import { projectMoveLogEntries } from "../moveLogProjection";

describe("practice first-player setup", () => {
  it.each([
    ["demo-choice-0", "p1"],
    ["demo-choice-2", "p2"],
  ])("leaves the random choice for %s with %s", (seed, chooserId) => {
    const engine = createPracticeEngine(createPracticeMatchConfig({ seed }));
    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseFirstPlayer",
      chooserId,
    });
  });

  it("lets the selected human choose to go second", () => {
    const engine = createPracticeEngine(createPracticeMatchConfig({ seed: "demo-choice-0" }));
    const result = engine.executeMove(
      "resolveFirstPlayer",
      { args: { goFirst: false } },
      createPlayerId("p1"),
    );
    expect(engine.getState().G.players.p2?.firstPlayer).toBe(true);
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).not.toBe("chooseFirstPlayer");
    expect(result.moveLogs).toContainEqual(
      expect.objectContaining({
        type: "action",
        playerId: createPlayerId("p1"),
        messageKey: "setup.firstPlayerChoice",
        params: { order: "second" },
      }),
    );
  });

  it("records when the selected bot chooses to go first", () => {
    const engine = createPracticeEngine(createPracticeMatchConfig({ seed: "demo-choice-2" }));
    const result = engine.executeMove(
      "resolveFirstPlayer",
      { args: { goFirst: true } },
      createPlayerId("p2"),
    );

    expect(engine.getState().G.players.p2?.firstPlayer).toBe(true);
    expect(result.moveLogs).toContainEqual(
      expect.objectContaining({
        type: "action",
        playerId: createPlayerId("p2"),
        messageKey: "setup.firstPlayerChoice",
        params: { order: "first" },
      }),
    );
    expect(
      projectMoveLogEntries(
        engine.getState(),
        result.moveLogs.map((log, index) => ({ id: index + 1, side: "opponent", log })),
        "player",
      ).map((entry) => entry.message),
    ).toContain("Rival chose to go first.");
  });
});

describe("createPracticeAiConfig", () => {
  it("does not assign AI to either seat in play-both-sides practice", () => {
    expect(createPracticeAiConfig(createPracticeMatchConfig({ mode: "self" }))).toEqual({
      player: null,
      opponent: null,
    });
  });

  it("uses hidden information for the default bot and keeps the human view filtered", () => {
    const config = createPracticeMatchConfig({ seed: "demo-choice-2" });
    expect(config.botStrategyId).toBe("expert-oracle");
    const botStrategy = createPracticeAiConfig(config).opponent;
    if (!botStrategy) throw new Error("Expected an Expert practice bot");
    expect(botStrategy.name).toBe("expert-oracle");
    const engine = createPracticeEngine(config).getLocalEngine();
    const oracle = vi.spyOn(engine, "getOracleView");
    const result = new AIPlayer(engine, createPlayerId("p2"), botStrategy).step();
    expect(result).toMatchObject({ kind: "acted", decision: { move: "resolveFirstPlayer" } });
    expect(oracle).toHaveBeenCalledWith(createPlayerId("p2"));
    const view = engine.getFilteredView(createPlayerId("p1"));
    expect(typeof view.players.p2?.zones.hand).toBe("number");
    expect(typeof view.players.p2?.zones.deck).toBe("number");
    oracle.mockRestore();
  });

  it("binds the authored deck profile onto the practice bot", () => {
    const config = createPracticeAiConfig(
      createPracticeMatchConfig({
        botDeckFixtureId: "authored-relic-placide-surgical-reanimation",
        playerDeckFixtureId: "authored-overwatch-recharge-control",
        botStrategyId: "tactical",
      }),
    );
    const opponent = config.opponent;
    if (!opponent) throw new Error("Expected a practice opponent strategy");
    expect(isTacticalAIStrategy(opponent)).toBe(true);
    if (!isTacticalAIStrategy(opponent)) return;
    expect(opponent.deckProfile?.deckId).toBe("authored-relic-placide-surgical-reanimation");
  });

  it("leaves engine starter fixtures unbound", () => {
    const config = createPracticeAiConfig(
      createPracticeMatchConfig({
        botDeckFixtureId: DEFAULT_BOT_PRACTICE_DECK_ID,
        botStrategyId: "tactical",
      }),
    );
    const opponent = config.opponent;
    if (!opponent) throw new Error("Expected a practice opponent strategy");
    expect(isTacticalAIStrategy(opponent)).toBe(true);
    if (!isTacticalAIStrategy(opponent)) return;
    expect(opponent.deckProfile).toBeUndefined();
  });

  it("infers an authored plan from an imported bot deck without a fixture id", () => {
    const fixture = getPracticeDeckFixture("authored-judy-top-deck-discount");
    expect(fixture).toBeTruthy();
    const config = createPracticeAiConfig(
      createImportedPracticeMatchConfig({
        playerDeck: fixture!.deck,
        botDeck: { ...fixture!.deck, playerId: "bot", playerName: "Judy bot" },
        botStrategyId: "tactical",
      }),
    );
    const opponent = config.opponent;
    if (!opponent) throw new Error("Expected a practice opponent strategy");
    expect(isTacticalAIStrategy(opponent)).toBe(true);
    if (!isTacticalAIStrategy(opponent)) return;
    expect(opponent.deckProfile?.deckId).toBe("authored-judy-top-deck-discount");
  });
});
