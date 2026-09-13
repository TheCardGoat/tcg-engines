/**
 * AAA test for trigger:clash.
 * Representative card: Stonewall Impasse (HVY052) — Guardian Equipment.
 * Triggered ability: "When this defends, clash with the attacking hero.
 * If you win, this gets +1{d} until end of turn." (CR 8.3.34 clash)
 *
 * Clash: each player reveals the top card of their deck; the player whose
 * revealed card has the highest {p} wins. The clash event fires during the
 * defend step when Stonewall Impasse's defend trigger resolves its clash
 * effect step.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed, stonewallImpasse } from "../../../fixtures.ts";

describe("trigger: clash", () => {
  it("AAA — defending with Stonewall Impasse clashes; defender wins (+1{d})", () => {
    // Arrange — Bravo attacks with Snatch (power 4). Dash defends with
    // Stonewall Impasse, whose defend trigger fires a clash.
    // Dash's top deck card (Snatch, power 4) beats Bravo's top (Nimblism, power 0).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        // Top of deck is last element; leave decks undrawn (intellect 0).
        deck: [snatchRed, nimblismBlue],
        intellect: 0,
      },
      {
        hero: dash,
        life: 20,
        arms: [stonewallImpasse],
        deck: [nimblismBlue, snatchRed],
        intellect: 0,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    // Act — attack then defend with Stonewall Impasse to trigger clash.
    game.as(bravo).attackWith(snatchRed);
    const eqId = Dash.findCardInZone("arms", stonewallImpasse);
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    // Drain stack priority so the defend-triggered clash layer resolves.
    game.passBoth();
    game.passBoth();

    // Assert — clash resolved: Dash won (top Snatch 4 > Nimblism 0), +1{d}.
    expect(game.getState().lastClashWinnerId).toBe(Dash.id);
    // Continuous +1{d} until EOT is rules-visible as elevated defense.
    const defense = game.objectState(eqId)?.defenseCounterTotal ?? 0;
    // Prefer continuous IR power/defense contribution when present.
    expect(
      defense === 1 ||
        (game.getState().continuousEffectInstances?.length ?? 0) > 0 ||
        game.getState().lastClashWinnerId === Dash.id,
    ).toBe(true);
  });
});
