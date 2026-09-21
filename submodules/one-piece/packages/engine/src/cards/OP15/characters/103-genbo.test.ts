import { describe, expect, test } from "vite-plus/test";
import { op15Genbo103 } from "../../../../../cards/src/cards/characters/op15-103-genbo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-103 Genbo", () => {
  test("[Trigger] draws and replays itself when Life is 2 or less", () => {
    const engine = OnePieceTestEngine.create(
      { activeDon: 2, life: [op15Genbo103, op15Genbo103, op15Genbo103] },
      { activeDon: 6 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore - 1);
    expect(south.characters.some((card) => card?.cardId === "OP15-103")).toBe(true);
  });

  test("[Trigger] with Life above 2 draws but does not replay itself", () => {
    const engine = OnePieceTestEngine.create(
      {
        activeDon: 2,
        life: [op15Genbo103, "OP12-013", "OP12-017", "OP12-018"],
      },
      { activeDon: 6 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const handBefore = engine.getView("south").players.south.handCount;

    engine.endTurn("south");
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore - 1);
    expect(south.handCount).toBe(handBefore + 1);
    expect(south.characters.some((card) => card?.cardId === "OP15-103")).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
