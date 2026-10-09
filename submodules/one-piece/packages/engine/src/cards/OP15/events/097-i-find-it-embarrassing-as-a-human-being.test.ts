import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-097 I Find It Embarrassing as a Human Being", () => {
  test("[Main] the paid Event becomes the tenth trash card and stops a base-cost-5-or-less Character from attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-097"],
        trash: Array.from({ length: 9 }, () => "OP13-013"),
        activeDon: 1,
      },
      {
        character: [{ cardId: "OP13-013", rested: false, attachedDon: 1 }, "OP16-003"],
        activeDon: 5,
      },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-097");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the cannot-attack target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([higumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    engine.endTurn("south");
    expect(() => engine.asNorth().attack("OP13-013", engine.asSouth().leader())).toThrow();
  });

  test("base cost 8 Characters are not eligible", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-097"],
        trash: Array.from({ length: 10 }, () => "OP13-013"),
        activeDon: 1,
      },
      { character: [{ cardId: "OP16-003", rested: false, attachedDon: 1 }], activeDon: 5 },
    );

    engine.playCard("OP15-097");

    expect(engine.getView("south").players.north.characters.map((c) => c?.cardId)).toContain(
      "OP16-003",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each([9, 10])("Life Trigger applies the Main trash threshold at %i", (trash) => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", life: ["OP15-097"], trash },
      {
        leaderCardId: "OP01-001",
        activeDon: 2,
        character: [{ cardId: "EB01-005", playedOnTurn: 0 }],
      },
      { activeSeat: "north" },
    );
    const target = engine.asNorth().findOnField("EB01-005");
    engine.asNorth().attachDon(engine.asNorth().leader(), 2);
    engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
    engine.asSouth().activateLifeTrigger();
    if (trash === 10) {
      engine.asSouth().chooseTargets(target);
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: target,
        targetId: engine.asSouth().leader(),
      });
    } else {
      engine.asNorth().attack(target, engine.asSouth().leader());
    }
    expect(
      engine
        .asSouth()
        .view()
        .players.south.trash.map((card) => card.cardId),
    ).toContain("OP15-097");
  });
});
