/**
 * DTD164 Blasmophet, Levia Consumed — demi-hero acceptance.
 *
 * a1: "While this is in your inventory, when blood debt reduces your {h} to 13,
 *      you may transform into Blasmophet, Levia Consumed."
 *      — physical twin acceptance covers this inventory trigger and selects
 *        Blasmophet as the single active hero-zone face.
 *
 * a2: "Once each turn, you may play a card with blood debt from your banished zone."
 *      — play permission from banished, once-per-turn (3 AAA tests).
 *
 * a3: "Whenever a card is put into your banished zone, turn it face-down.
 *      If you would lose {h} from blood debt, instead banish the top card of the deck."
 *      — turn-face-down trigger (AAA) + replacement effect (AAA).
 */
import { describe, expect, it } from "vitest";

import { blasmophetLeviaConsumed } from "../../../../cards/src/cards/demi-heroes/blasmophet-levia-consumed.ts";
import { dabbleInDarknessRed } from "../../../../cards/src/cards/actions/dabble-in-darkness.ts";
import { hungeringDemigonYellow } from "../../../../cards/src/cards/actions/hungering-demigon.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";
import { levia } from "../../../../cards/src/cards/heroes/levia.ts";
import { leviaRedeemed } from "../../../../cards/src/cards/demi-heroes/levia-redeemed.ts";
import { loadFleshAndBloodStructuredCards } from "../../../../cards/src/runtime-registry.ts";

describe("Blasmophet, Levia Consumed demi-hero (DTD164)", () => {
  it("CR 9.1.4: the physical twin exposes its inventory trigger, then selects Blasmophet in hero zone", async () => {
    const cards = await loadFleshAndBloodStructuredCards([leviaRedeemed.canonicalId]);
    const physicalLevia = cards.get(leviaRedeemed.canonicalId);
    expect(physicalLevia?.layout.kind).toBe("twin");
    if (!physicalLevia) throw new Error("physical DTD164 was not registered");

    const game = FabTestEngine.start(
      {
        hero: levia,
        life: 14,
        inventory: [physicalLevia],
        banished: [dabbleInDarknessRed],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Levia = game.as(levia);
    const instanceId = Levia.findCardInZone("inventory", physicalLevia);

    // Both face-local inventory abilities are present before transformation.
    expect(game.getState().objects[instanceId]?.activeFace).toMatchObject({
      family: "twin",
      activeFaceIds: [
        `${physicalLevia.canonicalId}:face:front`,
        `${physicalLevia.canonicalId}:face:back`,
      ],
    });

    Levia.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Levia.zone("inventory")).not.toContain(physicalLevia.canonicalId);
    expect(Levia.zone("heroZone")).toContain(physicalLevia.canonicalId);
    expect(game.getState().objects[instanceId]?.canonicalId).toBe(physicalLevia.canonicalId);
    expect(game.getState().objects[instanceId]?.activeFace).toMatchObject({
      family: "twin",
      activeFaceIds: [`${physicalLevia.canonicalId}:face:back`],
    });
  });

  it("a2: allows playing a blood-debt card from the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetLeviaConsumed],
        banished: [dabbleInDarknessRed],
        deck: 4,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Verify the blood-debt card is in the banished zone
    expect(Bravo.zone("banished")).toContain(dabbleInDarknessRed.canonicalId);

    // Play it from banished via Blasmophet's a2 permission
    const result = Bravo.play(dabbleInDarknessRed, { from: "banished" });
    expect(result.accepted).toBe(true);

    // After resolution (zero-cost attack resolves with no blocks), the card
    // should have left the banished zone
    expect(Bravo.zone("banished")).not.toContain(dabbleInDarknessRed.canonicalId);
  });

  it("a2 once-per-turn: second blood-debt play from banished is rejected", () => {
    // Use two zero-cost blood-debt cards
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetLeviaConsumed],
        banished: [dabbleInDarknessRed, dabbleInDarknessRed],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // First play should succeed
    const first = Bravo.play(dabbleInDarknessRed, { from: "banished" });
    expect(first.accepted).toBe(true);

    // Resolve the combat/stack so we're back in main phase
    game.passBoth();

    // Second play should be rejected — once per turn limit
    const second = Bravo.expectFailure({
      move: "begin-play",
      payload: {
        instanceId: Bravo.findCardInZone("banished", dabbleInDarknessRed),
        from: "banished",
      },
    });
    expect(second.accepted).toBe(false);
  });

  it("a2: non-blood-debt card cannot be played from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetLeviaConsumed],
        banished: [nimblismBlue],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    const rejected = Bravo.expectFailure({
      move: "begin-play",
      payload: {
        instanceId: Bravo.findCardInZone("banished", nimblismBlue),
        from: "banished",
      },
    });
    expect(rejected.accepted).toBe(false);
  });

  it("card loads into arena without errors", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetLeviaConsumed],
        deck: 8,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(game.as(bravo).zone("arena")).toContain(blasmophetLeviaConsumed.canonicalId);
  });

  it("a1: while in inventory, blood debt reducing life to 13 may transform it into a demi-hero", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        life: 14,
        inventory: [blasmophetLeviaConsumed],
        banished: [dabbleInDarknessRed], // blood-debt card
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Levia = game.as(levia);

    // Verify Blasmophet starts in inventory
    expect(Levia.zone("inventory")).toContain(blasmophetLeviaConsumed.canonicalId);

    // End turn — blood debt triggers for Dabble in Darkness in banished
    // and reduces Levia from 14 to 13, offering the optional transform.
    Levia.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Levia.life()).toBe(13);
    expect(Levia.zone("inventory")).not.toContain(blasmophetLeviaConsumed.canonicalId);
    expect(Levia.zone("heroZone")).toContain(blasmophetLeviaConsumed.canonicalId);
  });

  it("a1 boundary: blood debt does not offer the transform unless it reduces life exactly to 13", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        life: 15,
        inventory: [blasmophetLeviaConsumed],
        banished: [dabbleInDarknessRed],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Levia.life()).toBe(14);
    expect(Levia.zone("inventory")).toContain(blasmophetLeviaConsumed.canonicalId);
    expect(Levia.zone("heroZone")).not.toContain(blasmophetLeviaConsumed.canonicalId);
  });

  it("a3: turn-face-down — whenever a card is put into banished zone, turn it face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetLeviaConsumed],
        hand: [dabbleInDarknessRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Play Dabble in Darkness (cost 0). Its attack trigger banishes the top
    // card of the deck, which triggers Blasmophet's a3 move-zone → banished.
    Bravo.play(dabbleInDarknessRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // The card banished by Dabble's attack trigger should now be face-down.
    const banishedId = Bravo.findCardInZone("banished", snatchRed);
    expect(game.objectState(banishedId).faceDown).toBe(true);
  });

  it("a3: replacement — blood-debt life loss instead banishes top card of deck face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetLeviaConsumed],
        // Keep a full hand after playing Dabble so end-phase draw does not
        // obscure the replacement's one-card deck movement.
        hand: [dabbleInDarknessRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        banished: [hungeringDemigonYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Step 1 — trigger a3 by causing a move-to-banished event.
    // Playing Dabble in Darkness banishes top of deck on attack, which
    // triggers a3 and installs the replacement effect (while-in-arena).
    Bravo.play(dabbleInDarknessRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Step 2 — now the replacement is active. End the turn so blood debt
    // fires for Hungering Demigon (face-up, blood-debt in banished).
    const lifeBefore = Bravo.life();
    const deckBefore = Bravo.zone("deck").length;
    const banishedBefore = Bravo.zone("banished").length;

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Assert — life should NOT have decreased (replacement kicked in).
    expect(Bravo.life()).toBe(lifeBefore);
    // Deck shrinks by 1 (top card banished instead of life loss).
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
    // Banished zone grows by 1 (the newly banished deck card).
    expect(Bravo.zone("banished").length).toBe(banishedBefore + 1);
    const replacementBanishedId = Bravo.findCardInZone("banished", snatchRed);
    expect(game.objectState(replacementBanishedId).faceDown).toBe(true);
  });
});
