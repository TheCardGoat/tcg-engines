import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04Mr4Babe071 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-071 Mr.4 (Babe)", () => {
  test("may gain +1000 and Blocker before the Block Step, then loses both after battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Mr4Babe071], activeDon: 1 },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr4Id = engine.findCardInZone("south", "character", op04Mr4Babe071);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Mr.4's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(mr4Id);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mr4Id)
        ?.power,
    ).toBe(7000);
    engine.resolveDecision("battleBlocker", { selectedIds: [mr4Id] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.characters.find((card) => card?.instanceId === mr4Id)).toMatchObject({
      rested: true,
      power: 6000,
    });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or gaining Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Mr4Babe071], activeDon: 1 },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr4Id = engine.findCardInZone("south", "character", op04Mr4Babe071);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.characters.find((card) => card?.instanceId === mr4Id)).toMatchObject({
      rested: false,
      power: 6000,
    });
    expect(view.prompts).toHaveLength(0);
  });
});
