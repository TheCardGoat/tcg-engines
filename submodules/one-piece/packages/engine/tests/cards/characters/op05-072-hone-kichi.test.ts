import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op05HoneKichi072 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-072 Hone-Kichi", () => {
  test("with eight field DON!!, gives up to two opposing Characters -2000 power", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05HoneKichi072], activeDon: 8 },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op05HoneKichi072, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Hone-Kichi's power targets.");
    expect(target).toMatchObject({ min: 0, max: 2 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([firstId, secondId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === firstId)?.power).toBe(
      1000,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === secondId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("below eight field DON!!, does not reduce an opposing Character's power", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05HoneKichi072], activeDon: 7 },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op05HoneKichi072, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
