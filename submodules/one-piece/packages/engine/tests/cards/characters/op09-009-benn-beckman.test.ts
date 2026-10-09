import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Shanks120, op09BennBeckman009 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-009 Benn.Beckman", () => {
  test("trashes up to 1 opposing Character with 6000 power or less on play", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09BennBeckman009], activeDon: op09BennBeckman009.cost },
      { character: [eb01Doma005, eb01MountainGod018, op01Shanks120] },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const mountainGodId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const shanksId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.playCard(op09BennBeckman009, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Benn.Beckman's trash target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(mountainGodId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(shanksId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(domaId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([mountainGodId, shanksId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
  test("FAQ: trashing Lucky Roux does not activate its OnKO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP09-009"], activeDon: 7, character: ["ST02-012"] },
      { character: ["OP09-015"], leaderCardId: "OP09-001" },
    );
    const target = e.findCardInZone("north", "character", "OP09-015");
    e.asSouth().play("OP09-009");
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.characters.map((c) => c?.cardId)).toEqual(
      expect.arrayContaining(["OP09-009", "ST02-012"]),
    );
    expect(e.getView("north").prompts).toHaveLength(0);
  });
});
