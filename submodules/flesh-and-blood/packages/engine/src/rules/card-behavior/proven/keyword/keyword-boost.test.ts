/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:boost
 * Representative card: packages/cards/src/cards/actions/fast-and-furious.ts
 * Canonical id: TCKTLR7jQp6BDTkbdpfJn
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard, expectFabPlayer } from "../../../../index.ts";
import { bravo, dash, heartOfFyendal } from "../../../fixtures.ts";
import { fastAndFuriousRed } from "../../../../../../cards/src/cards/actions/fast-and-furious.ts";
import { cerebellumProcessorBlue } from "../../../../../../cards/src/cards/actions/cerebellum-processor.ts";

describe("keyword: boost", () => {
  it("AAA happy — boost banishes the top deck card; a Mechanologist card grants go again (CR 8.3.9)", () => {
    // Arrange — deck listed bottom→top: Cerebellum Processor (Mechanologist)
    // is on top and will be banished for the boost cost.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [fastAndFuriousRed], deck: [heartOfFyendal, cerebellumProcessorBlue] },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand so AP survives past combat close.
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act — pay the optional boost additional cost with the attack play.
    Bravo.must.playAttack(fastAndFuriousRed, { boost: true });
    game.helpers.resolveRestOfCombat();

    // Assert — the banished Mechanologist card grants the attack go again.
    expectFabCard(Bravo, cerebellumProcessorBlue).toBeBanished();
    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(17); // 20 − 3
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("AAA boundary — boost banishing a non-Mechanologist card boosts but grants no go again (CR 8.3.9a)", () => {
    // Arrange — Heart of Fyendal (generic resource, not Mechanologist) on top.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [fastAndFuriousRed], deck: [cerebellumProcessorBlue, heartOfFyendal] },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand so AP survives past combat close.
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Act
    Bravo.must.playAttack(fastAndFuriousRed, { boost: true });
    game.helpers.resolveRestOfCombat();

    // Assert — boosted (card banished) but no go again: AP is spent.
    expectFabCard(Bravo, heartOfFyendal).toBeBanished();
    expectCombat(game).toBeClosed();
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("AAA boundary — without boost the deck stays untouched and nothing is banished", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [fastAndFuriousRed], deck: [heartOfFyendal, cerebellumProcessorBlue] },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand so the deck survives to assertion.
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.must.playAttack(fastAndFuriousRed);
    game.helpers.resolveRestOfCombat();

    // Deck cards are hidden from the card-ref scope, so assert zone contents.
    expect(Bravo.zone("deck")).toContain(heartOfFyendal.canonicalId);
    expect(Bravo.zone("deck")).toContain(cerebellumProcessorBlue.canonicalId);
    expect(Bravo.zone("banished")).toHaveLength(0);
    expectFabPlayer(Bravo).toHaveAP(0);
  });
});
