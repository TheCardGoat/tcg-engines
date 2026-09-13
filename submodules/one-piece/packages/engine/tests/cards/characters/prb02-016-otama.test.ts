import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, prb02Otama016 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-016 Otama", () => {
  test("rests itself and takes top or bottom Life before giving 3000 power", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02Otama016],
      life: [eb01Doma005, eb01Fourtricks025],
    });
    const otamaId = engine.findCardInZone("south", "character", prb02Otama016);
    const bottomLifeId = engine.getState().players.south.life.at(-1)!;

    engine.activateEffect(otamaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const lifeCost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    expect(lifeCost?.kind).toBe("chooseOption");
    if (lifeCost?.kind !== "chooseOption") throw new Error("Expected Otama's Life choice.");
    expect(lifeCost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === otamaId)?.rested).toBe(
      true,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bottomLifeId);
    expect(view.players.south.leader.power).toBe(8000);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger rests only an opponent Character with cost 4 or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      {
        life: [prb02Otama016],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Otama's Trigger target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02Otama016],
      life: [eb01Doma005, eb01Fourtricks025],
    });
    const otamaId = engine.findCardInZone("south", "character", prb02Otama016);
    engine.activateEffect(otamaId, "activateMain", "south");
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
