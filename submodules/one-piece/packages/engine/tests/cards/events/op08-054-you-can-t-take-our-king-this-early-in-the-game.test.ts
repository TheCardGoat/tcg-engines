import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02Kingdew006,
  op02Vista011,
  op08YouCanTTakeOurKingThisEarlyInTheGame054,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-054 You Can't Take Our King This Early in the Game.", () => {
  test("Counter powers the defender and offers only the revealed eligible Character to play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op08YouCanTTakeOurKingThisEarlyInTheGame054],
        deck: [op02Vista011, eb01Doma005],
        activeDon: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op08YouCanTTakeOurKingThisEarlyInTheGame054,
    );
    const revealedId = engine.findCardInZone("north", "deck", op02Vista011);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the revealed Whitebeard Pirates play choice.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([revealedId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [revealedId] }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === revealedId),
    ).toBe(true);
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("declining the revealed play gives the controller the printed top-or-bottom choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op08YouCanTTakeOurKingThisEarlyInTheGame054],
        deck: [op02Vista011, eb01Doma005],
        activeDon: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op08YouCanTTakeOurKingThisEarlyInTheGame054,
    );
    const revealedId = engine.findCardInZone("north", "deck", op02Vista011);
    const remainingId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "north");
    engine.resolveDecision("effectRevealedDeckPosition", { optionId: "bottom" }, "north");

    expect(engine.getState().players.north.deck).toEqual([remainingId, revealedId]);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("a revealed cost-4 Whitebeard Pirates Character is ineligible and goes to the chosen position", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op08YouCanTTakeOurKingThisEarlyInTheGame054],
        deck: [op02Kingdew006, eb01Doma005],
        activeDon: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op08YouCanTTakeOurKingThisEarlyInTheGame054,
    );
    const revealedId = engine.findCardInZone("north", "deck", op02Kingdew006);
    const remainingId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const position = engine.pendingDecision("effectRevealedDeckPosition", "north").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") {
      throw new Error("Expected the ineligible reveal's top-or-bottom choice.");
    }
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectRevealedDeckPosition", { optionId: "bottom" }, "north");
    expect(engine.getState().players.north.deck).toEqual([remainingId, revealedId]);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
