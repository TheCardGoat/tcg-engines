import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120, op10SanjiSp003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST14-003 Sanji", () => {
  test("with an own cost-6-or-more Character K.O.s only an opposing cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10SanjiSp003],
        character: [op01Shanks120],
        activeDon: op10SanjiSp003.cost,
      },
      { character: [eb01Doma005, op01Shanks120] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.playCard(op10SanjiSp003, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Sanji's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
  });
});
