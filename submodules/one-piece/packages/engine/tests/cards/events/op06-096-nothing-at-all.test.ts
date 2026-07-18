import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06NothingAtAll096,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-096 ...Nothing...at All!!!", () => {
  test("Counter pays with the top Life card and prevents an eligible Character's battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op06NothingAtAll096],
        life: [eb01Fourtricks025],
        character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }],
        activeDon: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const defenderId = engine.findCardInZone("north", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op06NothingAtAll096);
    const lifeId = engine.findCardInZone("north", "life", eb01Fourtricks025);

    engine.declareAttack(attackerId, defenderId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === defenderId),
    ).toBe(true);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      lifeId,
    );
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      eventId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Counter, pays from the remaining Life, and protects a later battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      {
        life: [op06NothingAtAll096, eb01Fourtricks025],
        character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const [firstAttackerId, secondAttackerId] = engine
      .getState()
      .players.south.characterArea.filter((id): id is string => Boolean(id));
    const defenderId = engine.findCardInZone("north", "character", eb01Doma005);
    const remainingLifeId = engine.findCardInZone("north", "life", eb01Fourtricks025);

    engine.declareAttack(firstAttackerId!, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    engine.declareAttack(secondAttackerId!, defenderId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === defenderId),
    ).toBe(true);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      remainingLifeId,
    );
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
