import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Sanji014,
  eb02Jinbe055,
  eb02MonkeyDLuffy061,
  eb02MyskinaOlga053,
  eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-059 Without Your Help I Can't Become the King of the Pirates!!!!", () => {
  test("maps the Counter recipient and the low-Life yellow Straw Hat Crew-or-Sanji play union", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      {
        hand: [
          eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059,
          eb02Jinbe055,
          eb01Sanji014,
          eb02MyskinaOlga053,
          eb02MonkeyDLuffy061,
        ],
        activeDon: 4,
        life: 1,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059,
    );
    const yellowStrawHatId = engine.findCardInZone("north", "hand", eb02Jinbe055);
    const offColorSanjiId = engine.findCardInZone("north", "hand", eb01Sanji014);
    const unrelatedYellowId = engine.findCardInZone("north", "hand", eb02MyskinaOlga053);
    const tooExpensiveStrawHatId = engine.findCardInZone("north", "hand", eb02MonkeyDLuffy061);

    engine.endTurn("south");
    engine.endTurn("north");
    const beforeCounter = engine.getView("north").players.north;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "north");
    expect(powerDecision).toMatchObject({ actorId: "north", kind: "selectTargets" });
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the low-Life Character play choice.");
    }
    expect(playStep).toMatchObject({ min: 0, max: 1 });
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      yellowStrawHatId,
      offColorSanjiId,
    ]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      unrelatedYellowId,
    );
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      tooExpensiveStrawHatId,
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [yellowStrawHatId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.some((card) => card?.instanceId === yellowStrawHatId),
    ).toBe(true);
    expect(view.players.north.hand.some((card) => card.instanceId === offColorSanjiId)).toBe(true);
    expect(view.players.north.lifeCount).toBe(1);
    expect(view.players.north).toMatchObject({
      activeDon: beforeCounter.activeDon - 4,
      restedDon: beforeCounter.restedDon + 4,
    });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("still grants the Counter power but skips the play clause above 1 Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      {
        hand: [eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059, eb02Jinbe055],
        activeDon: 4,
        life: 2,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      eb02WithoutYourHelpICanTBecomeTheKingOfThePirates059,
    );
    const playId = engine.findCardInZone("north", "hand", eb02Jinbe055);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand.some((card) => card.instanceId === playId)).toBe(true);
    expect(view.players.north.lifeCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
