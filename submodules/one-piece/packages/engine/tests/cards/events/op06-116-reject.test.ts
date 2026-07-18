import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Hack012,
  op06Reject116,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-116 Reject", () => {
  test("Main K.O. branch removes a cost-5 Character, then adds the top Life card to hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Reject116],
        life: [eb01Fourtricks025],
        activeDon: 4,
      },
      {
        character: [op05Hack012],
      },
    );
    const targetId = engine.findCardInZone("north", "character", op05Hack012);
    const lifeId = engine.findCardInZone("south", "life", eb01Fourtricks025);

    engine.playCard(op06Reject116);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      lifeId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Main damage branch resolves Life before adding the controller's top Life card to hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Reject116],
        life: [eb01Fourtricks025],
        activeDon: 4,
      },
      {
        life: [eb01Doma005],
      },
    );
    const ownLifeId = engine.findCardInZone("south", "life", eb01Fourtricks025);
    const opposingLifeId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.playCard(op06Reject116);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(0);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      opposingLifeId,
    );
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      ownLifeId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one card without paying the Main Event cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op06Reject116],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
