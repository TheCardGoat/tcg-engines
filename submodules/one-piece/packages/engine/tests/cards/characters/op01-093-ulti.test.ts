import { describe, expect, test } from "vite-plus/test";
import { op01Ulti093 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-093 Ulti", () => {
  test("rests 1 DON!! on play to add one rested DON!! from the DON!! deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Ulti093],
      activeDon: op01Ulti093.cost + 1,
    });
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op01Ulti093, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Ulti's DON!! count choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(op01Ulti093.cost + 2);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore - 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Ulti093],
      activeDon: op01Ulti093.cost + 1,
    });
    engine.playCard(op01Ulti093, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
