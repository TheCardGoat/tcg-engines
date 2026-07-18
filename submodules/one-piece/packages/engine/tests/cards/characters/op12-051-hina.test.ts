import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01TonyTonyChopper006, op12Hina051 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("OP12-051 Hina", () => {
  test("rests itself and trashes a hand card before disabling a chosen Blocker for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        character: [op12Hina051],
      },
      {
        character: [eb01TonyTonyChopper006, eb01Fourtricks025],
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const hinaId = engine.findCardInZone("south", "character", op12Hina051);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const blockerId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);
    const futureBlockerId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.activateEffect(hinaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Hina's Blocker target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(futureBlockerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [blockerId] }, "south");

    const beforeAttack = engine.getView("south");
    expect(
      beforeAttack.players.south.characters.find((card) => card?.instanceId === hinaId)?.rested,
    ).toBe(true);
    expect(beforeAttack.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);

    const lifeBefore = beforeAttack.players.north.lifeCount;
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    const afterAttack = engine.getView("south");
    expect(afterAttack.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(
      afterAttack.players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);
    expect(afterAttack.prompts).toHaveLength(0);
  });
});
