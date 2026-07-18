import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op08CharlotteKatakuri063 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-063 Charlotte Katakuri", () => {
  test("may turn the face-up top Life face-down to add up to one active DON!!", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08CharlotteKatakuri063],
      life: [
        { card: eb01Doma005, faceUp: true, publicKnowledge: true },
        { card: eb01Fourtricks025, faceUp: true, publicKnowledge: true },
      ],
      activeDon: op08CharlotteKatakuri063.cost,
      donDeckCount: 1,
    });
    const lifeIds = [...engine.getState().players.south.life];

    engine.playCard(op08CharlotteKatakuri063, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon).toMatchObject({ kind: "chooseOption" });
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(engine.getState().cards[lifeIds[0]!]?.faceUp).toBe(false);
    expect(engine.getState().cards[lifeIds[1]!]?.faceUp).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("cannot pay with an already face-down top Life card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08CharlotteKatakuri063],
      life: [
        { card: eb01Doma005, faceUp: false, publicKnowledge: false },
        { card: eb01Fourtricks025, faceUp: true, publicKnowledge: true },
      ],
      activeDon: op08CharlotteKatakuri063.cost,
      donDeckCount: 1,
    });
    const lifeIds = [...engine.getState().players.south.life];

    engine.playCard(op08CharlotteKatakuri063, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: 1 });
    expect(engine.getState().cards[lifeIds[0]!]?.faceUp).toBe(false);
    expect(engine.getState().cards[lifeIds[1]!]?.faceUp).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
