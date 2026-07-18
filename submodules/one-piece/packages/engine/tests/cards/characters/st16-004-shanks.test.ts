import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op11ShanksSp004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST16-004 Shanks", () => {
  test("on play K.O.s only an opposing rested Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11ShanksSp004], activeDon: op11ShanksSp004.cost },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: false },
        ],
      },
    );
    const restedId = engine.findCardInZone("north", "character", eb01Doma005);
    const activeId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op11ShanksSp004, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Shanks's K.O. choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([restedId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(restedId);
    expect(view.players.north.characters.some((card) => card?.instanceId === activeId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
