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
});
