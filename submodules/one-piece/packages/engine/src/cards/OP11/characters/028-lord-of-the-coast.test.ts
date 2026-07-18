import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11LordOfTheCoast028 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-028 Lord of the Coast", () => {
  test("on play freezes only a rested opposing Character through its next Refresh Phase", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11LordOfTheCoast028], activeDon: op11LordOfTheCoast028.cost },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01MountainGod018, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const frozenId = engine.findCardInZone("north", "character", eb01Doma005);
    const otherId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op11LordOfTheCoast028, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Lord of the Coast's target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([frozenId, otherId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [frozenId] }, "south");

    engine.endTurn("south");
    let view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === frozenId)?.rested,
    ).toBe(true);
    expect(view.players.north.characters.find((card) => card?.instanceId === otherId)?.rested).toBe(
      false,
    );

    engine.endTurn("north");
    engine.endTurn("south");
    view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === frozenId)?.rested,
    ).toBe(false);
  });

  test("its Life Trigger belongs to the damaged player and K.O.s only an opposing rested cost-3 card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01MountainGod018, rested: true },
        ],
      },
      { life: [op11LordOfTheCoast028] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.pendingDecision("lifeTrigger", "north").actorId).toBe("north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Trigger K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(excludedId);
  });
});
