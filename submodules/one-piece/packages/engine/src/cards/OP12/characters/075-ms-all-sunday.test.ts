import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op12MsAllSunday075 } from "../../../../../cards/src/cards/characters/op12-075-ms-all-sunday.ts";

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
    // DON!! −1 is optional; accept and pay so the physical card is played.
    engine.accept("north");
    // Equivalent active DON!! auto-pay; the opponent still decides its DON!! reward.
    engine.asSouth().chooseAddDon(0);

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(sundayId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(sundayId);
    expect(view.players.north.activeDon).toBe(1);
  });
  test("FAQ: opponent may decline DON even when the K.O. selection is skipped", () => {
    const e = OnePieceTestEngine.create(
      { hand: [op12MsAllSunday075], activeDon: op12MsAllSunday075.cost },
      { character: [eb01Doma005] },
    );
    e.asSouth().play(op12MsAllSunday075);
    e.asSouth().chooseNoTargets();
    expect(e.pendingDecision("effectAddDon", "north").actorId).toBe("north");
    e.asNorth().chooseAddDon(0);
    expect(e.getView("north").players.north.activeDon).toBe(0);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
  });
  test("may decline the optional Trigger DON payment without playing the Life card", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op12MsAllSunday075], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("north", "life", op12MsAllSunday075);
    e.asSouth().attack(eb01MountainGod018, e.leader("north"));
    e.asNorth().activateLifeTrigger();
    e.asNorth().declineOptional();
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("north").players.north.activeDon).toBe(1);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
  });
});
