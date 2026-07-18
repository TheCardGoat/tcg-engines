import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op12Kuzan043,
  op12ZephyrNavy046,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-046 Zephyr(Navy)", () => {
  test("trashes two cards on play, then may trash itself to return either owner's cost-5 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12ZephyrNavy046, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        character: [eb01Doma005],
        activeDon: op12ZephyrNavy046.cost,
      },
      { character: [eb01MountainGod018, op12Kuzan043] },
    );
    const paymentIds = [
      engine.findCardInZone("south", "hand", eb01Doma005),
      engine.findCardInZone("south", "hand", eb01Fourtricks025),
    ];
    const ownTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op12Kuzan043);

    engine.playCard(op12ZephyrNavy046, "south");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(discard).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: paymentIds }, "south");

    const zephyrId = engine.findCardInZone("south", "character", op12ZephyrNavy046);
    engine.activateEffect(zephyrId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Zephyr's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownTargetId, opposingTargetId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([...paymentIds, zephyrId]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(ownTargetId);
  });
});
