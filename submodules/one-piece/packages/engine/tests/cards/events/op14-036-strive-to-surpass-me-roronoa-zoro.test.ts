import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op14eb04StriveToSurpassMeRoronoaZoro036,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-036 Strive to Surpass me, Roronoa Zoro!!!", () => {
  test("Counter rests one own card as cost before granting +4000", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op14eb04StriveToSurpassMeRoronoaZoro036], character: [eb01Doma005], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op14eb04StriveToSurpassMeRoronoaZoro036);
    const costId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectCostRestCards", { selectedIds: [costId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    expect(
      engine.getView("north").players.north.characters.find((card) => card?.instanceId === costId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Life Trigger rests one own card as cost, then an opposing base-power-7000-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [op14eb04StriveToSurpassMeRoronoaZoro036], character: [eb01Doma005] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    const costId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectCostRestCards", { selectedIds: [costId] }, "north");
    const rest = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(rest?.kind).toBe("selectEntity");
    if (rest?.kind !== "selectEntity") throw new Error("Expected an opposing rest target.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
    const view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === costId)?.rested).toBe(
      true,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
