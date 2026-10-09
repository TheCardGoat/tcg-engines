import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-058 The Prisoners Are Rioting", () => {
  test("[Main] with 10 DON!! sets all [Prisoner of Impel Down] base power to 7000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-058"], character: ["OP16-042", "OP16-042"], activeDon: 10 },
      {},
    );

    engine.playCard("OP16-058");

    const powers = engine
      .getView("south")
      .players.south.characters.flatMap((card) =>
        card?.cardId === "OP16-042" ? [card.power] : [],
      );
    expect(powers).toEqual([7000, 7000]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] saves a defending [Buggy] with +4000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-058"], character: [{ cardId: "OP16-031", rested: true }], activeDon: 10 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const buggyId = engine.findCardInZone("south", "character", "OP16-031");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", "OP16-031");
    engine.asSouth().chooseCounter("OP16-058");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [buggyId] }, "south");

    // 6000 + 4000 >= 10000: Buggy survives.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      buggyId,
    );
  });

  test("[Counter] includes a Buggy Leader and excludes other named cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP09-042",
        hand: ["OP16-058"],
        character: ["ST01-011"],
        activeDon: 2,
        life: 4,
      },
      { leaderCardId: "ST01-001", life: 4 },
    );
    engine.endTurn("south");
    engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
    engine.asSouth().chooseCounter("OP16-058");
    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected Buggy target selection.");
    expect(
      choice.candidates.filter((candidate) => candidate.legal).map((candidate) => candidate.ref.id),
    ).toEqual([engine.leader("south")]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    expect(engine.getView("south").players.south.lifeCount).toBe(4);
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
