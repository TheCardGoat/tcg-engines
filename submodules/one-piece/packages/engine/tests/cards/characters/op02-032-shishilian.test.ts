import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Inuarashi027, op02Shishilian032 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-032 Shishilian", () => {
  test("may rest two DON!! to ready a compound Minks Character costing 5 or less", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Shishilian032],
      character: [
        { card: op02Inuarashi027, rested: true },
        { card: eb01Doma005, rested: true },
      ],
      activeDon: 4,
    });
    const inuarashi = engine.findCardInZone("south", "character", op02Inuarashi027);
    const doma = engine.findCardInZone("south", "character", eb01Doma005);
    engine.playCard(op02Shishilian032, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected ready target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(inuarashi);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(doma);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [inuarashi] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(op02Shishilian032.cost + 2);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === inuarashi)?.rested,
    ).toBe(false);
  });

  test("may decline the rest-DON!! cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Shishilian032],
      character: [{ card: op02Inuarashi027, rested: true }],
      activeDon: 4,
    });
    const inuarashi = engine.findCardInZone("south", "character", op02Inuarashi027);
    engine.playCard(op02Shishilian032, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === inuarashi)?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.restedDon).toBe(op02Shishilian032.cost);
  });
});
