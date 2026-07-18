import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op13GumGumDawnStamp117 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-117 Gum-Gum Dawn Stamp", () => {
  test("Main turns the top Life face-up as cost before K.O.ing a base-cost-6-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13GumGumDawnStamp117], life: [eb01Doma005], activeDon: 5 },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.playCard(op13GumGumDawnStamp117);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    const view = engine.getView("south");
    const lifeId = engine.getState().players.south.life[0];
    expect(lifeId && engine.getState().cards[lifeId]?.faceUp).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op13GumGumDawnStamp117], deck: 6 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.getView("north").players.north.hand).toHaveLength(1);
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
