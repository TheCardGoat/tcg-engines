import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01Sanji014,
  eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030,
  eb02Sanji054,
  eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059,
  op13Higuma013,
  op13Otama043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-030 And That's When Somebody Makes Fun of Their Friend's Dream!!!!", () => {
  test("establishes a turn replacement and lets the defender trash a chosen hand card instead of battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030, eb01Sanji014],
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
        activeDon: 2,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030,
    );
    const replacementId = engine.findCardInZone("north", "hand", eb01Sanji014);

    engine.endTurn("south");
    engine.declareAttack(targetId, engine.leader("south"), "north");
    engine.endTurn("north");
    const replacementCandidateIds = engine
      .getState()
      .players.north.hand.filter((instanceId) => instanceId !== eventId);
    engine.declareAttack(attackerId, targetId, "south");
    const donBeforeCounter = engine.getView("north").players.north;
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const replacementDecision = engine.pendingDecision("battleKoReplacement", "north");
    const replacementStep = replacementDecision.steps[0];
    expect(replacementDecision.actorId).toBe("north");
    expect(replacementStep?.kind).toBe("selectEntity");
    if (replacementStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the later battle K.O. replacement choice.");
    }
    expect(replacementStep).toMatchObject({ min: 0, max: 1 });
    expect(replacementStep.candidates.map((candidate) => candidate.ref.id)).toEqual(
      replacementCandidateIds,
    );
    expect(replacementCandidateIds).toContain(replacementId);
    engine.resolveDecision("battleKoReplacement", { selectedIds: [replacementId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, replacementId]),
    );
    expect(view.players.north).toMatchObject({
      activeDon: donBeforeCounter.activeDon - 2,
      restedDon: donBeforeCounter.restedDon + 2,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("draws 1 for its Life Trigger without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        deck: [op13Otama043, op13Higuma013, eb01Sanji014, eb01Doma005],
        life: [eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.endTurn("south");
    engine.endTurn("north");
    const drawnId = engine.findCardInZone("north", "deck", op13Higuma013);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    const beforeTrigger = engine.getView("north").players.north;
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.some((card) => card.instanceId === drawnId)).toBe(true);
    expect(view.players.north.handCount).toBe(beforeTrigger.handCount + 1);
    expect(view.players.north.activeDon).toBe(beforeTrigger.activeDon);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030.id,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not protect a Character played after the Counter effect resolves", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      {
        hand: [
          eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030,
          eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059,
          eb02Sanji054,
          eb01Sanji014,
        ],
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
        activeDon: 4,
        life: 1,
      },
    );
    const attackerIds = engine
      .getView("south")
      .players.south.characters.filter((card) => card !== null)
      .map((card) => card.instanceId);
    const protectionEventId = engine.findCardInZone(
      "north",
      "hand",
      eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030,
    );
    const playEventId = engine.findCardInZone(
      "north",
      "hand",
      eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059,
    );
    const laterCharacterId = engine.findCardInZone("north", "hand", eb02Sanji054);
    const onPlayDiscardId = engine.findCardInZone("north", "hand", eb01Sanji014);

    engine.endTurn("south");
    engine.endTurn("north");

    engine.declareAttack(attackerIds[0]!, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [protectionEventId] }, "north");

    engine.declareAttack(attackerIds[1]!, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [playEventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [laterCharacterId] }, "north");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [onPlayDiscardId] },
      "north",
    );

    engine.declareAttack(attackerIds[2]!, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [laterCharacterId] }, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.prompts).toHaveLength(0);
    expect(
      view.players.north.characters.some((card) => card?.instanceId === laterCharacterId),
    ).toBe(false);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(laterCharacterId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
