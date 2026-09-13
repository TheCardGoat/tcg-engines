/**
 * Focused proofs for the four BVO gap-path engine consumers:
 * zone-count pitch gate, GY→deck-bottom replacement, opponent next-object
 * latch, and lose-abilities on hero activations.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine, FAB_MANUAL_HARNESS } from "../testing/index.ts";

import { bravoShowstopper } from "../../../cards/src/cards/heroes/bravo-showstopper.ts";
import { bravo } from "../../../cards/src/cards/heroes/bravo.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { azalea } from "../../../cards/src/cards/heroes/azalea.ts";
import { blessingOfDeliveranceBlue } from "../../../cards/src/cards/actions/blessing-of-deliverance.ts";
import { droneOfBrutalityBlue } from "../../../cards/src/cards/actions/drone-of-brutality.ts";
import { cartilageCrushRed } from "../../../cards/src/cards/actions/cartilage-crush.ts";
import { cartilageCrushYellow } from "../../../cards/src/cards/actions/cartilage-crush.ts";
import { crushConfidenceBlue } from "../../../cards/src/cards/actions/crush-confidence.ts";
import { crushConfidenceRed } from "../../../cards/src/cards/actions/crush-confidence.ts";
import { disableRed } from "../../../cards/src/cards/actions/disable.ts";
import { nimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import { nimblismRed } from "../../../cards/src/cards/actions/nimblism.ts";
import { markOfTheBeastYellow } from "../../../cards/src/cards/actions/mark-of-the-beast.ts";

describe("BVO gap-path engine consumers", () => {
  it("zone-count: Blessing enter-arena draws only with a cost-3+ card in pitch", () => {
    const withPitch = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [blessingOfDeliveranceBlue],
        pitch: [disableRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    withPitch.as(bravoShowstopper).play(blessingOfDeliveranceBlue);
    withPitch.helpers.resolveUntilIdle();
    expect(withPitch.as(bravoShowstopper).zone("hand")).toHaveLength(1);

    const withoutPitch = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [blessingOfDeliveranceBlue],
        pitch: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    withoutPitch.as(bravoShowstopper).play(blessingOfDeliveranceBlue);
    withoutPitch.helpers.resolveUntilIdle();
    expect(withoutPitch.as(bravoShowstopper).zone("hand")).toHaveLength(0);
  });

  it("replacement: Drone combat-close rewrite puts the card on the deck bottom", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [droneOfBrutalityBlue],
        resourcePoints: 2,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    Azalea.attackWith(droneOfBrutalityBlue);
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();
    expect(Azalea.zone("deck")[0]).toBe(droneOfBrutalityBlue.canonicalId);
    expect(Azalea.zone("graveyard")).not.toContain(droneOfBrutalityBlue.canonicalId);
  });

  it("future-object: Cartilage Crush taxes the damaged hero's first action, not a later one", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [cartilageCrushRed], resourcePoints: 3, deck: 6 },
      {
        hero: dash,
        life: 40,
        hand: [nimblismBlue, nimblismRed, disableRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);
    Bravo.attackWith(cartilageCrushRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.must.pitch(disableRed).play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    expect(Dash.resourcePoints()).toBe(0);
    Dash.play(nimblismRed);
    game.helpers.resolveUntilIdle();
    // CR 4.4.3f refilled Dash from 3 to 4 after turn 1; the three
    // deliberately played/pitched cards leave the one refill card behind.
    expect(Dash.zone("hand")).toHaveLength(1);
  });

  it("lose-abilities: crushed hero activation is rejected; crusher can still activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [crushConfidenceBlue],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, life: 20, resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Showstopper = game.as(bravoShowstopper);
    const Bravo = game.as(bravo);
    Showstopper.attackWith(crushConfidenceBlue);
    Bravo.defendWith();
    game.helpers.resolveRestOfCombat();
    Showstopper.activate(bravoShowstopper);
    game.helpers.resolveUntilIdle();
    expect(Showstopper.actionPoints()).toBe(1);
    Showstopper.endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.expectActivationRejected(bravo);
  });

  it("long-term: this-attack dummy + until-end-of-next-turn still taxes the damaged hero (WTR Cartilage)", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [cartilageCrushYellow], resourcePoints: 3, deck: 6 },
      {
        hero: dash,
        life: 40,
        hand: [nimblismBlue, nimblismRed, disableRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);
    Bravo.attackWith(cartilageCrushYellow);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.must.pitch(disableRed).play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    expect(Dash.resourcePoints()).toBe(0);
    Dash.play(nimblismRed);
    game.helpers.resolveUntilIdle();
    // CR 4.4.3f refilled Dash from 3 to 4 after turn 1.
    expect(Dash.zone("hand")).toHaveLength(1);
  });

  it("long-term: sibling Crush Confidence with attack-target subject strips the damaged hero", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [crushConfidenceRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, life: 20, resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Showstopper = game.as(bravoShowstopper);
    const Bravo = game.as(bravo);
    Showstopper.attackWith(crushConfidenceRed);
    Bravo.defendWith();
    game.helpers.resolveRestOfCombat();
    Showstopper.endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.expectActivationRejected(bravo);
  });

  it("long-term: from-anywhere GY replacement banishes Mark of the Beast on combat close", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [markOfTheBeastYellow],
        resourcePoints: 2,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    Azalea.attackWith(markOfTheBeastYellow);
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();
    expect(Azalea.zone("banished")).toContain(markOfTheBeastYellow.canonicalId);
    expect(Azalea.zone("graveyard")).not.toContain(markOfTheBeastYellow.canonicalId);
  });
});
