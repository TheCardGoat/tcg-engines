import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "../../../testing/index.ts";
import { levia } from "../../../../../cards/src/cards/heroes/levia.ts";
import { rhinar } from "../../../../../cards/src/cards/heroes/rhinar.ts";
import { brutalAssaultRed } from "../../../../../cards/src/cards/actions/brutal-assault.ts";
import { bloodDrippingFrenzyBlue } from "../../../../../cards/src/cards/actions/blood-dripping-frenzy.ts";
import { boneyardMarauderRed } from "../../../../../cards/src/cards/actions/boneyard-marauder.ts";
import { snatchRed } from "../../../../../cards/src/cards/actions/snatch.ts";
import { nimblismBlue } from "../../../../../cards/src/cards/actions/nimblism.ts";
import { scowlingFleshBag } from "../../../../../cards/src/cards/equipment/scowling-flesh-bag.ts";
import { hoovesOfTheShadowbeast } from "../../../../../cards/src/cards/equipment/hooves-of-the-shadowbeast.ts";
import { ursurTheSoulReaper } from "../../../../../cards/src/cards/tokens/ursur-the-soul-reaper.ts";
import { chainsOfConsecrationYellow } from "../../../../../cards/src/cards/instants/chains-of-consecration.ts";

// CR 3.0.7a's explicit Levia example. The pre-existing blood-debt card was
// banished on an earlier turn; the tested six-power history is never seeded.
describe("CR 3.0.7a — properties observed during banish", () => {
  it("private hand to private banished does not suppress Levia's blood debt", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [snatchRed, brutalAssaultRed],
        banished: [boneyardMarauderRed],
        resourcePoints: 0,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: rhinar, head: [scowlingFleshBag], hand: [], deck: [nimblismBlue, nimblismBlue] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);
    const Rhinar = game.as(rhinar);
    Levia.playAttack(snatchRed);
    Rhinar.defendWith(scowlingFleshBag);
    game.closeCombat();
    expectFabCard(Levia, brutalAssaultRed).toBeBanished().toBeFaceDown();
    expectFabPlayer(Rhinar).toHaveLife(18);
    Levia.endTurn();
    expectFabCard(Levia, brutalAssaultRed).toBeIn("hand");
    expectFabCard(Levia, boneyardMarauderRed).toBeBanished();
    expectFabPlayer(Levia).toHaveLife(19);
  });

  it("private hand to public banished does suppress Levia's blood debt", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [bloodDrippingFrenzyBlue, brutalAssaultRed],
        banished: [boneyardMarauderRed],
        resourcePoints: 2,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: rhinar, hand: [], deck: [nimblismBlue, nimblismBlue] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);
    Levia.play(bloodDrippingFrenzyBlue);
    game.untilIdle();
    expectFabCard(Levia, brutalAssaultRed).toBeBanished().toBeFaceUp();
    Levia.endTurn();
    expectFabCard(Levia, boneyardMarauderRed).toBeBanished();
    expectFabPlayer(Levia).toHaveLife(20);
  });

  it("public combat chain to face-down banished does not observe the card's properties", () => {
    // CR 3.0.8: the public attacking Ursur becomes private before Chains of
    // Consecration's face-down banish, so CR 3.0.7a hides its 6{p} from
    // Hooves of the Shadowbeast's banished-6-power trigger.
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [ursurTheSoulReaper],
        legs: [hoovesOfTheShadowbeast],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: rhinar,
        hand: [chainsOfConsecrationYellow],
        deck: [nimblismBlue, nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);
    const Rhinar = game.as(rhinar);
    Levia.pass();
    Rhinar.play(chainsOfConsecrationYellow);
    Rhinar.target(ursurTheSoulReaper);
    game.untilIdle();
    Levia.activateAttack(ursurTheSoulReaper);
    game.closeCombat({ optionals: "accept" });

    expect(
      game
        .committedEvents()
        .some(
          (event) =>
            event.name === "banish" &&
            event.data.object.canonicalId === ursurTheSoulReaper.canonicalId &&
            event.data.faceDown === true,
        ),
    ).toBe(true);
    // The 6{p} token was observed with no properties, so Hooves' optional
    // destruction never existed to accept: it stays equipped.
    expectFabCard(Levia, hoovesOfTheShadowbeast).toBeIn("legs");
  });
});
