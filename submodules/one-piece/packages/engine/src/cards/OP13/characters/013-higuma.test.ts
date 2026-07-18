import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op13Higuma013 } from "../../../../../cards/src/cards/OP13/characters/013-higuma.ts";
import { op13WoopSlap006 } from "../../../../../cards/src/cards/OP13/characters/006-woop-slap.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-013 Higuma", () => {
  test("K.O.'s only an opposing Character currently at 0 power or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13Higuma013], activeDon: op13Higuma013.cost },
      { character: [op13WoopSlap006, eb01Doma005] },
    );
    const eligibleId = engine.findCardInZone("north", "character", op13WoopSlap006);
    const excludedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13Higuma013, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Higuma's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });
});
