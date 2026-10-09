import { describe, expect, test } from "vite-plus/test";
import { op04CorridaColiseum096 } from "@tcg/op-cards";
import { op10Cub044 } from "../../../../../cards/src/cards/characters/op10-044-cub.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-044 Cub", () => {
  test("can rest a Dressrosa Stage as its optional cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Cub044],
      stage: op04CorridaColiseum096,
      activeDon: 1,
    });
    engine.playCard(op10Cub044, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.stage?.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").players.south.characters.filter(Boolean).length).toBeGreaterThan(
      0,
    );
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Cub044],
      stage: op04CorridaColiseum096,
      activeDon: 1,
    });
    engine.playCard(op10Cub044, "south");
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
  test("paid rest returns cost1 but excludes cost2 and own Characters", () => {
    const e = OnePieceTestEngine.create(
      { stage: "OP04-096", hand: ["OP10-044"], activeDon: 3, character: ["ST02-012"] },
      { character: ["ST02-012", "OP10-017"] },
    );
    const target = e.findCardInZone("north", "character", "ST02-012");
    e.asSouth().play("OP10-044");
    e.asSouth().acceptOptional();
    const choice = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected return target.");
    expect(choice.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("north").players.north.characters.some((c) => c?.cardId === "OP10-017")).toBe(
      true,
    );
    expect(e.getView("south").players.south.characters.some((c) => c?.cardId === "ST02-012")).toBe(
      true,
    );
  });
});
