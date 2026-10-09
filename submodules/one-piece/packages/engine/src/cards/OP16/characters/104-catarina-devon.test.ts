import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-104 Catarina Devon", () => {
  test("[When Attacking] its base power becomes the selected Character's power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-104", attachedDon: 1 }], activeDon: 5 },
      { character: ["OP16-003", "OP13-013"] },
    );
    const newgateId = engine.findCardInZone("north", "character", "OP16-003");

    engine.asSouth().attack("OP16-104", engine.asNorth().leader());
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power-copy target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [newgateId] }, "south");

    const devon = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === "OP16-104");
    // Newgate's 10000 base power, plus the attached DON!! bonus.
    expect(devon?.power).toBe(11000);
  });

  test("selecting no target leaves its own power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-104", attachedDon: 1 }], activeDon: 5 },
      { character: ["OP16-003", "OP13-013"] },
    );

    engine.asSouth().attack("OP16-104", engine.asNorth().leader());
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power-copy target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const devon = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === "OP16-104");
    expect(devon?.power).toBe(4000);
  });

  test("Life Trigger draws and plays a cost-1 Blackbeard Pirate from trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-001",
        life: ["OP16-104"],
        trash: ["OP16-103", "EB01-005", "OP16-107"],
        deck: ["EB01-025", "EB01-018"],
      },
      { leaderCardId: "OP01-001", activeDon: 2 },
      { activeSeat: "north" },
    );
    const augur = engine.asSouth().findInZone("trash", "OP16-103");
    engine.asNorth().attachDon(engine.asNorth().leader(), 2);
    engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
    engine.asSouth().activateLifeTrigger();
    const step = engine.asSouth().pendingDecision("effectPlaySelection").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected cost-1 Blackbeard play choice");
    expect(step.candidates.map((card) => card.ref.id)).toEqual([augur]);
    engine.asSouth().choosePlay("OP16-103");
    expect(engine.asSouth().findOnField("OP16-103")).toBe(augur);
    expect(
      engine
        .asSouth()
        .view()
        .players.south.hand.map((card) => card.cardId),
    ).toEqual(["EB01-025"]);
    expect(
      engine
        .asSouth()
        .view()
        .players.south.trash.map((card) => card.cardId),
    ).toContain("OP16-104");
  });
  test("copies current modified power rather than printed base power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-104", attachedDon: 1 }] },
      { character: ["OP15-060"] },
    );
    const target = engine.findCardInZone("north", "character", "OP15-060");
    expect(engine.getView("south").players.north.characters[0]?.power).toBe(10000);
    engine.asSouth().attack("OP16-104", engine.leader("north"));
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(11000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(3000);
  });
});
