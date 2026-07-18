import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op08Chess005, op08Kuromarimo004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-004 Kuromarimo", () => {
  test("with Chess, K.O.s only an opposing 3000-power-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08Kuromarimo004],
        character: [op08Chess005],
        activeDon: op08Kuromarimo004.cost,
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooStrongId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op08Kuromarimo004, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Kuromarimo's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooStrongId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(tooStrongId);
  });

  test("does not offer a K.O. without Chess", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08Kuromarimo004], activeDon: op08Kuromarimo004.cost },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op08Kuromarimo004, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
