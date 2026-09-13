/**
 * AAA test for trigger:clash-lose.
 * Representative card: Stonewall Impasse (HVY052) — Guardian Equipment.
 * Triggered ability: "When this defends, clash with the attacking hero.
 * If you win, this gets +1{d} until end of turn." (CR 8.3.34 clash)
 *
 * This test exercises the clash-lose outcome: the defending hero's revealed
 * card has lower {p} than the attacker's, so the attacker wins the clash.
 * The clash-lose event fires for the defender; no +1{d} prize is awarded.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed, stonewallImpasse } from "../../../fixtures.ts";

describe("trigger: clash-lose", () => {
  it("AAA — defender loses clash: attacker wins, no +1{d} on Stonewall", () => {
    // Arrange — Bravo attacks with Snatch (power 4). Dash defends with
    // Stonewall Impasse, whose defend trigger fires a clash.
    // Dash's top deck card (Nimblism, power 0) loses to Bravo's top (Snatch, power 4).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, snatchRed],
        intellect: 0,
      },
      {
        hero: dash,
        life: 20,
        arms: [stonewallImpasse],
        deck: [snatchRed, nimblismBlue],
        intellect: 0,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act — attack then defend with Stonewall Impasse to trigger clash.
    Bravo.attackWith(snatchRed);
    const eqId = Dash.findCardInZone("arms", stonewallImpasse);
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.passBoth();
    game.passBoth();

    // Assert — clash-lose for defender: attacker won, no +1{d} prize.
    expect(game.getState().lastClashWinnerId).toBe(Bravo.id);
    expect(game.objectState(eqId)?.defenseCounterTotal ?? 0).toBe(0);
  });
});
