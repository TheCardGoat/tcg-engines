import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op12MsAllSunday075 } from "../../../../../cards/src/cards/OP12/characters/075-ms-all-sunday.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-075 Ms. All Sunday", () => {
  test("K.O.s an opposing cost-3-or-less Character before that opponent adds active DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op12MsAllSunday075], activeDon: op12MsAllSunday075.cost },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op12MsAllSunday075, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Sunday's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "north").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.activeDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("returns one DON!! to play the physical card from Life through its Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op12MsAllSunday075],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: 2,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sundayId = engine.findCardInZone("north", "life", op12MsAllSunday075);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(sundayId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(sundayId);
    expect(view.players.north.activeDon).toBe(1);
  });
});
