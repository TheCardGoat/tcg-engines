import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { arakni } from "../heroes/arakni.ts";
import { arakniWebOfDeceit } from "../heroes/arakni-web-of-deceit.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue, nimblismRed } from "./nimblism.ts";
import { rememberTheMistsBlue } from "./remember-the-mists.ts";

/**
 * Remember the Mists (MPA026) — Assassin Action - Attack, cost 2, 4{p}.
 *
 * Printed: "When this hits a hero, look at their hand and banish a card. They
 * may play the banished card until the end of their next turn.\nIf this
 * wasn't played from hand or arsenal, it gets +2{p}."
 *
 * The hit's granted permission is the key to the +2{p} bonus leg: the banished
 * card itself may be another Remember the Mists, and an Assassin defender may
 * play it from the banished zone inside the window — a play that came from
 * neither hand nor arsenal.
 */

describe("Remember the Mists (MPA026) AAA", () => {
  it("happy: played from arsenal, a hit banishes a card from the defender's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arsenal: [rememberTheMistsBlue],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.playAttack(rememberTheMistsBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4); // played from arsenal: no +2
    Dash.defendWith();
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).toHaveHandCount(0);
    expect(Dash.zone("banished")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: a blocked miss leaves the defender's hand untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arsenal: [rememberTheMistsBlue],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.playAttack(rememberTheMistsBlue, { from: "arsenal" });
    Dash.defendWith(nimblismBlue, nimblismBlue); // 4{d} blanks the 4 power
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("banished")).toHaveLength(0); // no hit, no hand banish
  });

  it("timing: the banished card is another Mists, and the defender's banished play gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [rememberTheMistsBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
        deckTop: [nimblismBlue],
      },
      {
        hero: arakniWebOfDeceit,
        hand: [rememberTheMistsBlue, nimblismRed, nimblismRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Arakni = game.as(arakni);
    const WebOfDeceit = game.as(arakniWebOfDeceit);

    Arakni.playAttack(rememberTheMistsBlue);
    WebOfDeceit.defendWith();
    game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
    Arakni.target(rememberTheMistsBlue); // the attacker looks and banishes the Mists copy
    game.closeCombat();
    expectFabCard(WebOfDeceit, rememberTheMistsBlue).toBeIn("banished");
    Arakni.endTurn();

    // The Web of Deceit is an Assassin and may play the banished card inside
    // the granted window; the play came from neither hand nor arsenal, so the
    // printed +2{p} applies on top of the printed 4{p}.
    WebOfDeceit.playAttack(rememberTheMistsBlue, { from: "banished" });
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(6);
    Arakni.defendWith();
    game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
    WebOfDeceit.target(nimblismBlue); // this hit's banish: the attacker picks from Arakni's hand
    game.closeCombat();
    // The banished play swung at its printed 4 + 2{p}.
    expectFabPlayer(Arakni).toHaveLife(14);
    WebOfDeceit.endTurn();
  });
});
