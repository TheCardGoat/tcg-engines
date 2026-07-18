import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op11LongJawNeptunian103,
  op11Shirahoshi022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-103 Long-Jaw Neptunian", () => {
  test("with Shirahoshi, rests itself and turns top Life face-down before K.O.ing a cost-3 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11Shirahoshi022,
        character: [op11LongJawNeptunian103],
        life: [{ card: eb01Doma005, faceUp: true }],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const sourceId = engine.findCardInZone("south", "character", op11LongJawNeptunian103);
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Neptunian's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === sourceId)?.rested,
    ).toBe(true);
    expect(engine.getState().cards[lifeId]?.faceUp).toBe(false);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
  });

  test("cannot activate without a Shirahoshi Leader", () => {
    const engine = OnePieceTestEngine.create({ character: [op11LongJawNeptunian103] });
    const sourceId = engine.findCardInZone("south", "character", op11LongJawNeptunian103);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sourceId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
