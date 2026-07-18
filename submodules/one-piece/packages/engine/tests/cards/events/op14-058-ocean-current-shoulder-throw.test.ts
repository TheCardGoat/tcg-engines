import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op13Koala081,
  op13Koby025,
  op14eb04Kuroobi045,
  op14eb04OceanCurrentShoulderThrow058,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-058 Ocean Current Shoulder Throw", () => {
  test("Main rests three DON!!, plays an included Fish-Man, then offers either field's base-power-6000 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04OceanCurrentShoulderThrow058, op14eb04Kuroobi045],
        character: [op13Koala081],
        activeDon: 5,
      },
      { character: [op13Koby025] },
    );
    const playId = engine.findCardInZone("south", "hand", op14eb04Kuroobi045);
    const ownTargetId = engine.findCardInZone("south", "character", op13Koala081);
    const opposingTargetId = engine.findCardInZone("north", "character", op13Koby025);
    engine.playCard(op14eb04OceanCurrentShoulderThrow058);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playId] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south");
    const step = target.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected an either-field return choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownTargetId,
      opposingTargetId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(ownTargetId);
    expect(view.players.south.characters.some((card) => card?.instanceId === playId)).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
  });

  test("Counter draws one and gives the defending Leader +3000", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op14eb04OceanCurrentShoulderThrow058], activeDon: 2 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op14eb04OceanCurrentShoulderThrow058);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    const view = engine.getView("north");
    expect(view.players.north.hand).toHaveLength(1);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
