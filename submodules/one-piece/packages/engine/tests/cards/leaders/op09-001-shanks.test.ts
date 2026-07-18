import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09Shanks001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("OP09-001 Shanks", () => {
  test("can decline the first attack and apply −1000 power to a later attacker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { leaderCardId: op09Shanks001 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    engine.declareAttack(characterId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Shanks's power target choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), characterId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(2000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
