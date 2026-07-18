import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06YouReTheOneWhoShouldDisappear115,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-115 You're the One Who Should Disappear", () => {
  test("declining the optional Counter cost trashes no hand card and grants no battle power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op06YouReTheOneWhoShouldDisappear115, eb01Fourtricks025],
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op06YouReTheOneWhoShouldDisappear115);
    const retainedId = engine.findCardInZone("north", "hand", eb01Fourtricks025);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      retainedId,
    );
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toEqual([
      eventId,
    ]);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Counter trashes a hand card before granting the chosen battle recipient +3000", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op06YouReTheOneWhoShouldDisappear115, eb01Fourtricks025],
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op06YouReTheOneWhoShouldDisappear115);
    const costId = engine.findCardInZone("north", "hand", eb01Fourtricks025);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, costId]),
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("last-Life Trigger may add the top deck card even when there is no hand card to trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op06YouReTheOneWhoShouldDisappear115],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const topDeckId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const lifeDecision = engine.pendingDecision("effectAddToLifeFromDeck", "north");
    expect(lifeDecision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [
        { id: "0", value: "0" },
        { id: "1", value: "1" },
      ],
    });
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "north");

    expect(engine.getState().players.north.life).toEqual([topDeckId]);
    expect(engine.getState().cards[topDeckId]?.faceUp).toBe(false);
    expect(engine.getView("south").players.north.lifeCount).toBe(1);
    expect(engine.getView("north").players.north.hand).toHaveLength(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("choosing no deck card still requires the following hand trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb01Doma005],
        life: [op06YouReTheOneWhoShouldDisappear115],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const trashId = engine.findCardInZone("north", "hand", eb01Doma005);
    const deckBefore = [...engine.getState().players.north.deck];

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "0" }, "north");

    expect(engine.getState().players.north.life).toHaveLength(0);
    expect(engine.getState().players.north.deck).toEqual(deckBefore);
    expect(engine.getState().players.north.trash).toContain(trashId);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("the Trigger does nothing when one Life remains after damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb01Doma005],
        life: [op06YouReTheOneWhoShouldDisappear115, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const deckBefore = [...engine.getState().players.north.deck];
    const handId = engine.findCardInZone("north", "hand", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getState().players.north.life).toHaveLength(1);
    expect(engine.getState().players.north.deck).toEqual(deckBefore);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      handId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
