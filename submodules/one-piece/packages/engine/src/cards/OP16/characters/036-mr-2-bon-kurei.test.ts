import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-036 Mr.2 Bon.Kurei", () => {
  test("[On Play] may rest an opposing Character with cost 4 or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-036"], activeDon: 4 },
      { character: [{ cardId: "OP16-024", rested: false }, "OP16-003"] },
    );
    const inazumaId = engine.findCardInZone("north", "character", "OP16-024");

    engine.playCard("OP16-036");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the rest target.");
    // Newgate (cost 8) must not be a candidate.
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([inazumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [inazumaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === inazumaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[When Attacking] its base power becomes the opposing Leader's power during this turn", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP16-036"], activeDon: 5 }, {});
    const leaderPower = engine.getView("south").players.north.leader?.power ?? 0;

    engine.asSouth().attack("OP16-036", engine.asNorth().leader());

    const mr2 = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === "OP16-036");
    expect(mr2?.power).toBe(leaderPower);
  });
});
