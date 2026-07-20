import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13KouzukiMomonosuke105 } from "../../../../../cards/src/cards/OP13/characters/105-kouzuki-momonosuke.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-105 Kouzuki Momonosuke", () => {
  test("looks at and reorders every physical card in its controller's Life", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13KouzukiMomonosuke105],
      life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op13KouzukiMomonosuke105.cost,
    });
    const lifeIds = [
      engine.findCardInZone("south", "life", eb01Doma005),
      engine.findCardInZone("south", "life", eb01Fourtricks025),
      engine.findCardInZone("south", "life", eb01MountainGod018),
    ];

    engine.playCard(op13KouzukiMomonosuke105, "south");
    const decision = engine.pendingDecision("effectRearrangeLifeOrder", "south");
    expect(decision.actorId).toBe("south");
    const order = decision.steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected Momonosuke's Life order.");
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(lifeIds);
    engine.resolveDecision(
      "effectRearrangeLifeOrder",
      { selectedIds: [...lifeIds].reverse() },
      "south",
    );

    expect(engine.getState().players.south.life).toEqual([...lifeIds].reverse());
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
