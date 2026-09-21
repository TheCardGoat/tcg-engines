import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-037 Mr.3", () => {
  test("[On Play] with an Impel Down Leader may rest an opposing Character with cost 5 or less", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP02-071", hand: ["OP16-037"], activeDon: 2 },
      { character: [{ cardId: "OP16-024", rested: false }, "OP16-003"] },
    );
    const inazumaId = engine.findCardInZone("north", "character", "OP16-024");

    engine.playCard("OP16-037");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([inazumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [inazumaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === inazumaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without an Impel Down Leader the On Play does not trigger", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-037"], activeDon: 2 },
      { character: [{ cardId: "OP16-024", rested: false }] },
    );

    engine.playCard("OP16-037");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.cardId === "OP16-024")
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
