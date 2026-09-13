import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op07RobLucci079 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-079 Rob Lucci", () => {
  test("trashes the top two deck cards before mapping the opposing cost reduction", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07RobLucci079,
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstTrashedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondTrashedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const targetCostBefore = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === targetId)?.cost;
    if (targetCostBefore === undefined || targetCostBefore === null) {
      throw new Error("Expected the target to expose its current cost.");
    }

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Lucci's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toHaveLength(2);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstTrashedId, secondTrashedId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      targetCostBefore - 1,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      targetCostBefore,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07RobLucci079,
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
