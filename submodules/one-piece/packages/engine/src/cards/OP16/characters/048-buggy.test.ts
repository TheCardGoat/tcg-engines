import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-048 Buggy", () => {
  test("[On Play] with an Impel Down Leader draws 1 and may play a [Prisoner of Impel Down]", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP02-071", hand: ["OP16-048", "OP16-042"], activeDon: 5 },
      {},
    );

    engine.playCard("OP16-048");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-042");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Once Per Turn] on an opposing attack a [Prisoner of Impel Down] gains [Blocker] for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-048", "OP16-042"], activeDon: 5 },
      { character: [{ cardId: "EB01-005", attachedDon: 1 }] },
    );
    const prisonerId = engine.findCardInZone("south", "character", "OP16-042");
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("EB01-005", engine.asSouth().leader());
    engine.acceptLeadingOptional("south");
    const grant = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected the blocker grant target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [prisonerId] }, "south");

    // The freshly granted [Blocker] may intercept this very attack.
    engine.asSouth().chooseBlocker("OP16-042");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === prisonerId)
        ?.rested,
    ).toBe(true);
  });
});
