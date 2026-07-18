import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op07MonkeyDDragon015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-015 Monkey.D.Dragon", () => {
  test("on play gives two rested DON!! to one Leader or Character and Rush permits an immediate attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07MonkeyDDragon015],
        character: [eb01Doma005],
        activeDon: op07MonkeyDDragon015.cost,
        restedDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op07MonkeyDDragon015, "south");
    const dragonId = engine.findCardInZone("south", "character", op07MonkeyDDragon015);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Dragon's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Dragon's DON!! recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), allyId, dragonId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [dragonId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === dragonId)
        ?.attachedDon,
    ).toBe(2);
    engine.declareAttack(dragonId, engine.leader("north"), "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === dragonId)
        ?.rested,
    ).toBe(true);
  });
});
