import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02EdwardNewgate001,
  op02Squard009,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-009 Squard", () => {
  test("with a compound Whitebeard Pirates Leader trait, reduces an opposing Character then adds top Life to hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EdwardNewgate001,
        hand: [op02Squard009],
        life: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
        activeDon: op02Squard009.cost,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const topLifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op02Squard009, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity")
      throw new Error("Expected Squard's power-reduction target.");
    expect(target.candidates.find((candidate) => candidate.ref.id === targetId)?.legal).toBe(true);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      -1000,
    );
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(topLifeId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not reduce power or take Life when its Leader lacks Whitebeard Pirates", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Squard009],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op02Squard009.cost,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op02Squard009, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
