import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03BeloBetty056,
  op05Conis104,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-056 Belo Betty", () => {
  test("turns top Life face-up, then K.O.s only an opposing base-cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03BeloBetty056],
        life: [eb01Doma005, eb01Fourtricks025],
        activeDon: eb03BeloBetty056.cost,
      },
      { character: [eb01Doma005, op05Conis104, eb01MountainGod018] },
    );
    const topLifeId = engine.getState().players.south.life[0]!;
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const otherLowCostId = engine.findCardInZone("north", "character", op05Conis104);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb03BeloBetty056, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Belo Betty's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      lowCostId,
      otherLowCostId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");

    expect(engine.getState().cards[topLifeId]?.faceUp).toBe(true);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      lowCostId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("can decline the optional Life cost without turning Life face-up or K.O.ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03BeloBetty056],
        life: [eb01Doma005],
        activeDon: eb03BeloBetty056.cost,
      },
      { character: [eb01Doma005] },
    );
    const topLifeId = engine.getState().players.south.life[0]!;
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(eb03BeloBetty056, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getState().cards[topLifeId]?.faceUp).toBe(false);
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === targetId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
