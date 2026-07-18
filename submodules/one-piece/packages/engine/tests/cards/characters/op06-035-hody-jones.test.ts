import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06HodyJones035 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-035 Hody Jones", () => {
  test("rests a total of two opposing Characters or DON!! and takes the top Life card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06HodyJones035],
        life: [eb01Doma005],
        activeDon: op06HodyJones035.cost,
      },
      { character: [eb01Doma005], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op06HodyJones035, "south");
    const hodyId = engine.findCardInZone("south", "character", op06HodyJones035);

    const rest = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    expect(rest?.kind).toBe("payCost");
    if (rest?.kind !== "payCost") throw new Error("Expected Hody Jones's mixed rest choice.");
    expect(rest).toMatchObject({ min: 0, max: 2 });
    const donId = rest.candidates.find((candidate) => candidate.ref.kind === "option")?.ref.id;
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(donId).toBeDefined();
    engine.resolveDecision(
      "effectMixedRestSelection",
      { selectedIds: [targetId, donId!] },
      "south",
    );

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.prompts).toHaveLength(0);

    const opposingLifeBefore = view.players.north.lifeCount;
    engine.declareAttack(hodyId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(opposingLifeBefore - 1);
  });
});
