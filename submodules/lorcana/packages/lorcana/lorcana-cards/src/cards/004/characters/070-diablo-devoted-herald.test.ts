import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { friendsOnTheOtherSide } from "../../001/actions/064-friends-on-the-other-side";
import { aWholeNewWorld } from "../../001/actions/195-a-whole-new-world";
import { letTheStormRageOn } from "../../002/actions/199-let-the-storm-rage-on";
import { hiramFlavershamToymaker } from "../../002/characters/149-hiram-flaversham-toymaker";
import { pawpsicle } from "../../002/items/169-pawpsicle";
import { brawl } from "../actions/130-brawl";
import { diabloMaleficentsSpy } from "./071-diablo-maleficents-spy";
import { diabloDevotedHerald } from "./070-diablo-devoted-herald";
import { diabloStoneServant } from "../../012/characters/196-diablo-stone-servant";

describe("Diablo - Devoted Herald", () => {
  it("has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [diabloDevotedHerald],
    });

    expect(testEngine.asPlayerOne().hasKeyword(diabloDevotedHerald, "Evasive")).toBe(true);
  });

  it("Shift: Discard an action card - can shift onto a Diablo by discarding an action card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 0,
      play: [diabloMaleficentsSpy],
      hand: [brawl, diabloDevotedHerald],
    });

    const shiftTarget = testEngine.findCardInstanceId(diabloMaleficentsSpy, "play", PLAYER_ONE);
    const actionToDiscard = testEngine.findCardInstanceId(brawl, "hand", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(diabloDevotedHerald, {
        cost: {
          cost: "shift",
          shiftTarget: shiftTarget!,
          discardCards: [actionToDiscard!],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(diabloDevotedHerald)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(brawl)).toBe("discard");
  });

  it("Shift: can shift onto a 2-cost Diablo (Stone Servant, set 12) — R30 regression", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 0,
      play: [diabloStoneServant],
      hand: [brawl, diabloDevotedHerald],
    });

    const shiftTarget = testEngine.findCardInstanceId(diabloStoneServant, "play", PLAYER_ONE);
    const actionToDiscard = testEngine.findCardInstanceId(brawl, "hand", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(diabloDevotedHerald, {
        cost: {
          cost: "shift",
          shiftTarget: shiftTarget!,
          discardCards: [actionToDiscard!],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(diabloDevotedHerald)).toBe("play");
  });

  it("canPlayCard reports the discard-action Shift as legal even when all ink is exerted (digest-2026-05-08 #27/#28/#29)", () => {
    // Player report: "Diablo shifting seems to be bugged when shifting after ink has
    // been spent. ... On the next turn, it allowed me to shift before I spent any ink."
    // Diablo - Devoted Herald's Shift cost is purely "Discard an action card" — no ink
    // component — so the simulator's Play CTA should remain available regardless of
    // available ink. canPlayCard previously returned false because it only validated
    // the standard ink cost; now it falls through to the Shift path when standard fails.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: [
        { card: brawl, exerted: true },
        { card: brawl, exerted: true },
        { card: brawl, exerted: true },
      ],
      play: [diabloMaleficentsSpy],
      hand: [brawl, diabloDevotedHerald],
    });

    expect(testEngine.asPlayerOne().canPlayCard(diabloDevotedHerald)).toBe(true);
  });

  it("lists action cards in hand as selectable discard costs for Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 0,
      play: [diabloMaleficentsSpy],
      hand: [brawl, friendsOnTheOtherSide, diabloDevotedHerald],
    });

    const player = testEngine.asPlayerOne();
    const shiftCardId = testEngine.findCardInstanceId(diabloDevotedHerald, "hand", PLAYER_ONE);
    const shiftTargetId = testEngine.findCardInstanceId(diabloMaleficentsSpy, "play", PLAYER_ONE);
    const brawlId = testEngine.findCardInstanceId(brawl, "hand", PLAYER_ONE);
    const friendsId = testEngine.findCardInstanceId(friendsOnTheOtherSide, "hand", PLAYER_ONE);

    expect(
      player.getAvailableMoves().find((move) => move.moveId === "shiftCard")?.selectableCardIds,
    ).toContain(shiftCardId);
    expect(player.getMoveOptions("shiftCard", shiftCardId)).toContainEqual({
      kind: "card",
      cardId: shiftTargetId,
      selectableCosts: [
        {
          kind: "discardCards",
          count: 1,
          candidateCardIds: [brawlId, friendsId],
          zone: "hand",
          cardType: "action",
        },
      ],
    });
  });

  describe("CIRCLE FAR AND WIDE - whenever the opponent draws a card while this character is exerted, you may draw a card.", () => {
    it("triggers when opponent draws cards while Diablo is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
        },
        {
          deck: 7,
          play: [{ card: diabloDevotedHerald, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

      // friendsOnTheOtherSide draws 2 cards for P1 → 2 opportunities for CIRCLE FAR AND WIDE
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(2);

      testEngine.asPlayerTwo().resolveAllBagEffects();

      const p2Zones = testEngine.asPlayerTwo().getZonesCardCount();
      expect(p2Zones.hand).toBe(2);
      expect(p2Zones.deck).toBe(5);
    });

    it("does not draw cards for the opponent when Diablo is ready", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          hand: [friendsOnTheOtherSide],
          inkwell: friendsOnTheOtherSide.cost,
        },
        {
          deck: 7,
          play: [{ card: diabloDevotedHerald, exerted: false }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

      // Intervening-if (exerted) is re-evaluated at resolution; resolve any pending
      // bag items and verify no cards ended up in P2's hand/deck counts changed.
      testEngine.asPlayerTwo().resolveAllBagEffects();

      const p2Zones = testEngine.asPlayerTwo().getZonesCardCount();
      expect(p2Zones.hand).toBe(0);
      expect(p2Zones.deck).toBe(7);
    });

    it("does not trigger on the controller's own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: aWholeNewWorld.cost,
          hand: [aWholeNewWorld],
          play: [{ card: diabloDevotedHerald, exerted: true }],
          deck: 7,
        },
        {
          deck: 7,
        },
      );

      expect(testEngine.asPlayerOne().playCard(aWholeNewWorld)).toBeSuccessfulCommand();

      // Diablo is P1's. Trigger has `whose: "opponent"` during-turn restriction →
      // no bag effects should fire for either player from the controller's draws.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("creates one bag effect per card drawn when opponent plays A Whole New World", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: aWholeNewWorld.cost,
          hand: [aWholeNewWorld],
          deck: 7,
        },
        {
          play: [{ card: diabloDevotedHerald, exerted: true }],
          deck: 7,
        },
      );

      expect(testEngine.asPlayerOne().playCard(aWholeNewWorld)).toBeSuccessfulCommand();

      // A Whole New World: "Each player draws 7 cards." For the opponent's 7 draws,
      // CIRCLE FAR AND WIDE should queue one optional bag effect per draw.
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(7);
    });
  });

  it("triggers during the opponent's mandatory Draw Phase draw (pass-turn)", () => {
    // P1 owns Diablo (exerted). P1 passes the turn; P2's Draw Phase draws 1 card.
    // That mandatory draw should fire CIRCLE FAR AND WIDE, putting 1 bag item in P1's bag.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: diabloDevotedHerald, exerted: true }],
        deck: 5,
      },
      {
        deck: 10,
      },
    );

    // Clear any bag effects from the initial fixture setup.
    testEngine.asPlayerOne().resolveAllBagEffects();
    testEngine.asPlayerTwo().resolveAllBagEffects();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Verify P2 actually drew a card during their Draw Phase.
    const p2ZonesAfter = testEngine.asPlayerTwo().getZonesCardCount();
    expect(p2ZonesAfter.deck).toBe(9);
    expect(p2ZonesAfter.hand).toBe(1);

    // Check the authoritative server bag count for diagnostic purposes.
    const serverBagCount = testEngine.getBoard("authoritative").bagEffects.length;
    // P2's mandatory draw fires during their Draw Phase.
    // CIRCLE FAR AND WIDE should place one optional bag item in P1's bag.
    expect(serverBagCount).toBe(1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    testEngine.asPlayerOne().resolveAllBagEffects();
    const p1Zones = testEngine.asPlayerOne().getZonesCardCount();
    expect(p1Zones.hand).toBe(1);
    expect(p1Zones.deck).toBe(4);
  });

  describe("Regression", () => {
    it("Let the Storm Rage On interaction - opponent's draw still triggers while Diablo was exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: letTheStormRageOn.cost,
          hand: [letTheStormRageOn],
          deck: 2,
        },
        {
          play: [{ card: diabloDevotedHerald, exerted: true }],
          deck: 7,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(letTheStormRageOn, {
          targets: [diabloDevotedHerald],
        }),
      ).toBeSuccessfulCommand();

      // Diablo (willpower 2) is banished by Let the Storm Rage On's 2 damage
      expect(testEngine.asPlayerTwo().getCardZone(diabloDevotedHerald)).toBe("discard");

      // Storm Rage On's sequence is: deal 2 damage → state-based banish of Diablo
      // → draw 1 card. By the time P1's draw event fires, Diablo is already in
      // discard, so CIRCLE FAR AND WIDE can't trigger (its source is out of play).
      // P2's hand/deck must be untouched.
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      testEngine.asPlayerTwo().resolveAllBagEffects();

      const p2Zones = testEngine.asPlayerTwo().getZonesCardCount();
      expect(p2Zones.hand).toBe(0);
      expect(p2Zones.deck).toBe(7);
      expect(p2Zones.discard).toBe(1);
    });

    it("creates bag effects when opponent triggers multiple draws in sequence", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [hiramFlavershamToymaker, pawpsicle],
          deck: 5,
          inkwell: 10,
        },
        {
          play: [{ card: diabloDevotedHerald, exerted: true }],
          deck: 5,
        },
      );

      // Clear any bag effects already queued from P1's mandatory turn draw so we
      // measure only the delta from the quest-induced draws.
      testEngine.asPlayerTwo().resolveAllBagEffects();
      testEngine.asPlayerOne().resolveAllBagEffects();
      const p2BagBefore = testEngine.asPlayerTwo().getBagCount();

      expect(testEngine.asPlayerOne().quest(hiramFlavershamToymaker)).toBeSuccessfulCommand();

      // Questing queues Hiram's ARTIFICER optional trigger into P1's bag. Resolve
      // it by banishing pawpsicle to draw 2 cards. Each of those 2 draws should
      // queue a separate CIRCLE FAR AND WIDE bag effect on P2.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(hiramFlavershamToymaker, {
          resolveOptional: true,
          targets: [pawpsicle],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount() - p2BagBefore).toBe(2);
    });
  });
});
