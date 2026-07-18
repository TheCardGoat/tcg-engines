import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05BartholomewKuma011,
  op05IBid500Million096,
  op06ButIWillNeverDoubtAWomanSTears057,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-057 But I Will Never Doubt a Woman's Tears!!!!", () => {
  test("Main powers first, reveals publicly, and offers only the revealed cost-2 Character to play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06ButIWillNeverDoubtAWomanSTears057],
      deck: [op05BartholomewKuma011, eb01Doma005],
      activeDon: 1,
    });
    const revealedId = engine.findCardInZone("south", "deck", op05BartholomewKuma011);
    const leaderBefore = engine.getView("south").players.south.leader.power ?? 0;

    engine.playCard(op06ButIWillNeverDoubtAWomanSTears057);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const playDecision = engine.pendingDecision("effectPlaySelection", "south");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the revealed cost-2 Character play choice.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([revealedId]);
    expect(engine.getView("south").players.south.leader.power).toBe(leaderBefore + 1000);
    expect(
      engine
        .getView("north")
        .logs.some((entry) => entry.message.includes(op05BartholomewKuma011.name)),
    ).toBe(true);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [revealedId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === revealedId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test.each(["top", "bottom"] as const)(
    "declining the revealed play places the card at the chosen %s of the deck",
    (position) => {
      const engine = OnePieceTestEngine.create({
        hand: [op06ButIWillNeverDoubtAWomanSTears057],
        deck: [op05BartholomewKuma011, eb01Doma005],
        activeDon: 1,
      });
      const revealedId = engine.findCardInZone("south", "deck", op05BartholomewKuma011);
      const remainingId = engine.findCardInZone("south", "deck", eb01Doma005);

      engine.playCard(op06ButIWillNeverDoubtAWomanSTears057);
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [engine.leader("south")] },
        "south",
      );
      engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

      const positionDecision = engine.pendingDecision("effectRevealedDeckPosition", "south");
      const positionStep = positionDecision.steps[0];
      expect(positionStep?.kind).toBe("chooseOption");
      if (positionStep?.kind !== "chooseOption") {
        throw new Error("Expected the revealed card's top-or-bottom deck decision.");
      }
      expect(positionStep.options.map((option) => option.id)).toEqual(["top", "bottom"]);
      engine.resolveDecision("effectRevealedDeckPosition", { optionId: position }, "south");

      expect(engine.getState().players.south.deck).toEqual(
        position === "top" ? [revealedId, remainingId] : [remainingId, revealedId],
      );
      expect(engine.getView("south").prompts).toHaveLength(0);
      expect(engine.getState().capabilityHistory).toHaveLength(0);
    },
  );

  test.each([
    { topCard: eb01Doma005, label: "wrong-cost Character" },
    { topCard: op05IBid500Million096, label: "non-Character" },
  ])(
    "skipping the power target still reveals a $label and proceeds directly to deck placement",
    ({ topCard }) => {
      const engine = OnePieceTestEngine.create({
        hand: [op06ButIWillNeverDoubtAWomanSTears057],
        deck: [topCard, eb01MountainGod018],
        activeDon: 1,
      });
      const revealedId = engine.findCardInZone("south", "deck", topCard);
      const remainingId = engine.findCardInZone("south", "deck", eb01MountainGod018);

      engine.playCard(op06ButIWillNeverDoubtAWomanSTears057);
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

      engine.pendingDecision("effectRevealedDeckPosition", "south");
      expect(
        engine.getView("north").logs.some((entry) => entry.message.includes(topCard.name)),
      ).toBe(true);
      engine.resolveDecision("effectRevealedDeckPosition", { optionId: "bottom" }, "south");

      expect(engine.getState().players.south.deck).toEqual([remainingId, revealedId]);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("Life Trigger plays only an exact cost-2 Character from hand without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op05BartholomewKuma011, eb01Doma005],
        life: [op06ButIWillNeverDoubtAWomanSTears057],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("north", "hand", op05BartholomewKuma011);
    const excludedId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the Trigger's exact cost-2 hand play choice.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    expect(
      engine.getView("north").decisions.some((decision) => decision.id === playDecision.id),
    ).toBe(true);
    expect(
      engine.getView("south").decisions.some((decision) => decision.id === playDecision.id),
    ).toBe(false);
    expect(
      engine.getView("spectator").decisions.some((decision) => decision.id === playDecision.id),
    ).toBe(false);
    expect(
      engine.getView("judge").decisions.some((decision) => decision.id === playDecision.id),
    ).toBe(true);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
