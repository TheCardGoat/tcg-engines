import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Kaido094 } from "@tcg/op-cards";
import { op13Edison102 } from "../../../../../cards/src/cards/OP13/characters/102-edison.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-102 Edison", () => {
  test("at equal Life trashes itself to draw and optionally rest an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op13Edison102],
        life: 3,
        deck: [eb01Fourtricks025, eb01Doma005],
      },
      { life: 3, character: [eb01Doma005, op01Kaido094] },
    );
    const edisonId = engine.findCardInZone("south", "character", op13Edison102);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", op01Kaido094);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.activateEffect(edisonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Edison's rest target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    const candidates = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(eligibleId);
    expect(candidates).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(edisonId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("with more Life rejects activation before trashing itself or resting a Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13Edison102], life: 4, deck: [eb01Fourtricks025] },
      { life: 3, character: [eb01Doma005] },
    );
    const edisonId = engine.findCardInZone("south", "character", op13Edison102);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: edisonId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(edisonId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger draws and optionally rests an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
      },
      {
        life: [op13Edison102, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const restTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const triggerId = engine.findCardInZone("north", "life", op13Edison102);
    const drawnId = engine.findCardInZone("north", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Edison's Trigger rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(restTargetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restTargetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === restTargetId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
