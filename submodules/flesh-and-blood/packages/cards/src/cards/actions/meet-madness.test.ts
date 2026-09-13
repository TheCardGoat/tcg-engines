import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { meetMadnessRed } from "./meet-madness.ts";

/**
 * Meet Madness (AAC014) — Chaos Assassin Action - Attack. Stealth. 0-cost 3{p}/3{d}.
 * When this hits a hero, choose 1 at random:
 * - They choose a card in their hand. Banish it.
 * - They choose a card in their arsenal. Banish it.
 * - Banish the top card of their deck.
 */

describe("Meet Madness (AAC014) AAA", () => {
  it("happy: when this hits a hero, a random mode banishes a card from their hand, arsenal, or deck", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [meetMadnessRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue],
        arsenal: [snatchRed],
        deckTop: [heartOfFyendalBlue],
      },
      { ...FAB_MANUAL_HARNESS, seed: "meet-madness-aaa-hit" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(meetMadnessRed);
    Dash.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(17);
    const banished = Dash.zone("banished").length + Bravo.zone("banished").length;
    expect(banished).toBeGreaterThanOrEqual(1);
    const vanishedFromDash =
      Dash.zone("hand").length === 0 ||
      Dash.zone("arsenal").length === 0 ||
      Dash.zone("deck").length === 0;
    expect(vanishedFromDash).toBe(true);
  });

  it("boundary: a blocked miss does not banish from the defending hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [meetMadnessRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        deckTop: [heartOfFyendalBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(meetMadnessRed);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expect(Dash.zone("banished")).toHaveLength(0);
  });

  it("timing: the random banish fires on hit, not merely on attack declaration", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [meetMadnessRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue],
        arsenal: [snatchRed],
        deckTop: [heartOfFyendalBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(meetMadnessRed);
    expect(Dash.zone("banished")).toHaveLength(0);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expect(Dash.zone("banished")).toHaveLength(0);
  });
});
