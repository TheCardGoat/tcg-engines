import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op08Carrot021,
  op08CharlotteOpera102,
  op08Inuarashi022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-021 Carrot", () => {
  test("recognizes an included Minks type and maps only opposing cost-5-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08Carrot021,
        character: [op08Inuarashi022],
      },
      {
        character: [eb01Doma005, eb01MountainGod018, op08CharlotteOpera102],
      },
    );
    const cheapId = engine.findCardInZone("north", "character", eb01Doma005);
    const boundaryId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", op08CharlotteOpera102);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Carrot's rest target choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([cheapId, boundaryId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === boundaryId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === excludedId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
