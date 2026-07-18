import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op13Higuma013,
  op13Otama043,
  prb02EdwardNewgateSt13004PirateFoil004,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST13-004 Edward.Newgate", () => {
  test("adds the deck top to Life, privately moves one Life card to the deck top, and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [prb02EdwardNewgateSt13004PirateFoil004],
      life: [{ card: eb01Doma005, faceUp: true, publicKnowledge: true }, eb01Fourtricks025],
      deck: [op13Higuma013, op13Otama043, eb01MountainGod018],
      activeDon: prb02EdwardNewgateSt13004PirateFoil004.cost,
    });
    const originalLife = [...engine.getState().players.south.life];
    const addedFromDeckId = engine.getState().players.south.deck[0]!;
    const movedToDeckId = originalLife[1]!;
    const remainingLifeOrder = [addedFromDeckId, originalLife[0]!];

    engine.playCard(prb02EdwardNewgateSt13004PirateFoil004, "south");

    const order = engine.pendingDecision("effectRearrangeLifeOrder", "south").steps[0];
    expect(order).toMatchObject({ kind: "orderItems", min: 3, max: 3 });
    if (order?.kind !== "orderItems") throw new Error("Expected Newgate's private Life order.");
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([...originalLife, addedFromDeckId]),
    );
    engine.resolveDecision(
      "effectRearrangeLifeOrder",
      { selectedIds: [movedToDeckId, ...remainingLifeOrder] },
      "south",
    );

    expect(engine.getState().players.south.deck[0]).toBe(movedToDeckId);
    expect(engine.getState().players.south.life).toEqual(remainingLifeOrder);
    expect(engine.getState().cards[originalLife[0]!]!.faceUp).toBe(true);
    expect(engine.getState().cards[movedToDeckId]!).toMatchObject({
      zone: "deck",
      faceUp: false,
      publicKnowledge: false,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
