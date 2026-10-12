import { describe, expect, it } from "vitest";
import { alphaClashCardImageUrl } from "./components/Arena3D/card-artwork";
import {
  createAlphaClashPracticeEngine,
  alphaClashPracticeSetupFromSearch,
} from "./practice-setup";

const setup = {
  playerDeckId: "clarity-hyper-aggro",
  opponentDeckId: "absence-makati",
  strategyId: "meta-v1",
  seed: "alpha-practice-proof",
};

describe("Alpha Clash local practice", () => {
  it("requires deck selection and admits canonical and existing launch links", () => {
    expect(alphaClashPracticeSetupFromSearch("?mode=self")).toBeNull();
    expect(
      alphaClashPracticeSetupFromSearch(
        "?playerDeck=absence-makati&opponentDeck=clarity-hyper-aggro&strategy=meta-v1&seed=42",
      ),
    ).toEqual({
      playerDeckId: "absence-makati",
      opponentDeckId: "clarity-hyper-aggro",
      strategyId: "meta-v1",
      seed: "42",
    });
    expect(
      alphaClashPracticeSetupFromSearch("?deckA=starter-titan@42&deckB=starter-warden"),
    ).toMatchObject({
      playerDeckId: "starter-titan@42",
      opponentDeckId: "starter-warden",
      strategyId: "meta-v1",
    });
    expect(() => alphaClashPracticeSetupFromSearch("?deckA=missing")).toThrow(
      "Unknown Alpha Clash practice deck",
    );
    expect(() =>
      alphaClashPracticeSetupFromSearch("?playerDeck=clarity-hyper-aggro&strategy=missing"),
    ).toThrow("available practice opponent");
  });

  it("creates legal decks with repeatable opening hands from the selected seed", async () => {
    const first = await createAlphaClashPracticeEngine(setup);
    const second = await createAlphaClashPracticeEngine(setup);
    const opening = (engine: typeof first) =>
      Object.values(engine.state.cards)
        .filter((card) => card.zone === "hand")
        .map((card) => [card.owner, card.definitionId]);
    expect(opening(first)).toEqual(opening(second));
    expect(first.state.phase.name).toBe("setup");
    for (const card of Object.values(first.state.cards)) {
      expect(alphaClashCardImageUrl(card.definitionId), card.definitionId).toBeDefined();
    }
    expect(first.state.activePlayer).toBe("player-one");
    expect(
      Object.values(first.state.cards).filter((card) => card.owner === "player-one"),
    ).toHaveLength(51);
    expect(
      Object.values(first.state.cards).filter((card) => card.owner === "player-two"),
    ).toHaveLength(61);
    const different = await createAlphaClashPracticeEngine({ ...setup, seed: "different" });
    expect(opening(different)).not.toEqual(opening(first));
  });

  it("uses the recommended heuristic through opening choices and a complete native match", async () => {
    const engine = await createAlphaClashPracticeEngine(setup);
    const context = { gameId: "practice-proof", sourceAuthority: "server" as const };
    const actors = [];
    let actions = 0;
    while (!engine.hasGameEnded() && actions < 1500) {
      actors.push(engine.getActivePlayerId());
      const result = engine.takeAutomatedAction({ strategyId: setup.strategyId }, context);
      expect(
        result.finalResult.success,
        result.finalResult.success ? undefined : result.finalResult.error,
      ).toBe(true);
      if (!result.finalResult.success) break;
      actions++;
    }
    expect(actors.slice(0, 3)).toEqual(["human", "bot", "human"]);
    expect(engine.hasGameEnded()).toBe(true);
    expect(engine.getGameEndResult()?.winnerId).toBeTruthy();
    expect(actions).toBeGreaterThan(20);
    expect(
      engine.state.moveLog.some(
        (entry) => entry.public && entry.message.includes("keeps their opening hand"),
      ),
    ).toBe(true);
    const invalid = await createAlphaClashPracticeEngine(setup);
    expect(
      invalid.takeAutomatedAction({ strategyId: "missing" }, context).finalResult.success,
    ).toBe(false);
    expect(invalid.getStateID()).toBe(0);
  }, 30_000);
});
