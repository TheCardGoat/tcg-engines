import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op08Kalgara098,
  op08Kalgara099,
  op08MontBlancNoland109,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-109 Mont Blanc Noland", () => {
  test("with an included Shandian Warrior Leader and Kalgara adds the deck top to Life", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08Kalgara098,
      hand: [op08MontBlancNoland109],
      character: [op08Kalgara099],
      deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005],
      activeDon: op08MontBlancNoland109.cost,
    });
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op08MontBlancNoland109, "south");
    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    expect(addLife).toMatchObject({ kind: "chooseOption" });
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore + 1);
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not add Life without a Kalgara Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08Kalgara098,
      hand: [op08MontBlancNoland109],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op08MontBlancNoland109.cost,
    });
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op08MontBlancNoland109, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
