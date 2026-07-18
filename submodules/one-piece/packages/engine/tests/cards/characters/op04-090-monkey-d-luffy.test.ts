import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04MonkeyDLuffy090,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-090 Monkey.D.Luffy", () => {
  test("can always attack an active Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04MonkeyDLuffy090, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffyId = engine.findCardInZone("south", "character", op04MonkeyDLuffy090);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(luffyId, targetId, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === luffyId)
        ?.rested,
    ).toBe(true);
  });

  test("may return seven chosen trash cards to ready itself once, then misses its next Refresh", () => {
    const trash = [
      eb01Doma005,
      eb01Fourtricks025,
      eb01MountainGod018,
      eb01Doma005,
      eb01Fourtricks025,
      eb01MountainGod018,
      eb01Doma005,
      eb01Fourtricks025,
    ];
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04MonkeyDLuffy090, rested: true, playedOnTurn: 0 }],
        trash,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffyId = engine.findCardInZone("south", "character", op04MonkeyDLuffy090);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const trashIds = [...engine.getState().players.south.trash];
    const selectedIds = trashIds.slice(1);

    engine.activateEffect(luffyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === luffyId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      trashIds,
    );

    engine.activateEffect(luffyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Luffy's ordered trash cost.");
    expect(cost).toMatchObject({ min: 7, max: 7 });
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(trashIds);
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([trashIds[0]]);
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      false,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: luffyId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.declareAttack(luffyId, targetId, "south");
    engine.endTurn("south");
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      true,
    );

    engine.endTurn("south");
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
