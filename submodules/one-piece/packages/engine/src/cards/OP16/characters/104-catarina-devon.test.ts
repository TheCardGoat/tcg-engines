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
    const target = engine.pendingDecision("effectSetPowerFromSource", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power-copy target.");
    engine.resolveDecision("effectSetPowerFromSource", { selectedIds: [newgateId] }, "south");

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
    const target = engine.pendingDecision("effectSetPowerFromSource", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power-copy target.");
    engine.resolveDecision("effectSetPowerFromSource", { selectedIds: [] }, "south");

    const devon = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === "OP16-104");
    expect(devon?.power).toBe(4000);
  });
});
