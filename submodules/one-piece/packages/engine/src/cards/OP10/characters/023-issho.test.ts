import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Shanks120,
  op10Issho023,
  op10Smoker001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-023 Issho", () => {
  test("with an inclusively matching Navy Leader, rests up to two cost-5 Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Smoker001,
        hand: [op10Issho023],
        activeDon: op10Issho023.cost,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018, op01Shanks120] },
    );
    const costThreeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const costFiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const tooExpensiveId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.playCard(op10Issho023, "south");
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(rest).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (rest?.kind !== "selectEntity") throw new Error("Expected Issho's rest choice.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual([costThreeId, costFiveId]);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [costThreeId, costFiveId] },
      "south",
    );

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costThreeId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costFiveId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === tooExpensiveId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
