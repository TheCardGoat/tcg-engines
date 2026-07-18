import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01Shanks120,
  op14eb04Foxy036,
  op14eb04GroggyMonsters033,
  op14eb04Porche037,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-033 Groggy Monsters", () => {
  test("returns one DON!!, then with three Foxy Pirates K.O.s only a Character with 6000 base power or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04GroggyMonsters033],
        character: [op14eb04Foxy036, op14eb04Porche037],
        activeDon: op14eb04GroggyMonsters033.cost + 1,
      },
      { character: [eb01Doma005, op01Shanks120] },
    );
    const lowPowerId = engine.findCardInZone("north", "character", eb01Doma005);
    const highPowerId = engine.findCardInZone("north", "character", op01Shanks120);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op14eb04GroggyMonsters033, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const returnDon = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(returnDon?.kind).toBe("payCost");
    if (returnDon?.kind !== "payCost") throw new Error("Expected Groggy Monsters' DON!! cost.");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Groggy Monsters' K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([lowPowerId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highPowerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowPowerId] }, "south");

    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      lowPowerId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline the DON!! cost when it has fewer than three Foxy Pirates Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04GroggyMonsters033],
        character: [op14eb04Foxy036],
        activeDon: op14eb04GroggyMonsters033.cost + 1,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op14eb04GroggyMonsters033, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
