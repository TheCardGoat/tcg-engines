/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:crank
 * Representative card: packages/cards/src/cards/actions/cerebellum-processor.ts
 * Canonical id: tmCzWCtfttrQdLCbWGC6B
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
import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard, expectFabPlayer } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { itemTrainer } from "../../../test-trainers.ts";
import { cerebellumProcessorBlue } from "../../../../../../cards/src/cards/actions/cerebellum-processor.ts";
import { fastAndFuriousRed } from "../../../../../../cards/src/cards/actions/fast-and-furious.ts";

describe("keyword: crank", () => {
  it("AAA happy — cranking on enter removes a steam counter and grants an action point (CR 8.3.29)", () => {
    // Arrange — Cerebellum Processor is a cost-0 item; it enters with 2 steam
    // counters and the crank choice defaults to yes in the harness.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cerebellumProcessorBlue], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act — play the item; it enters the arena and the crank choice recorded
    // during the play journal is consumed on entry.
    Bravo.must.play(cerebellumProcessorBlue);
    Bravo.must.passPriority();
    Dash.must.passPriority();

    // Assert — permanent in arena, one steam counter spent, AP refunded.
    expectFabCard(Bravo, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Bravo, cerebellumProcessorBlue).toHaveCounters(1, "steam");
    expectFabPlayer(Bravo).toHaveAP(1); // 1 − 1 play + 1 crank
  });

  it("AAA boundary — declining crank keeps all steam counters and grants no action point (CR 8.3.29)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cerebellumProcessorBlue], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.must.play(cerebellumProcessorBlue, { crank: false });
    Bravo.must.passPriority();
    Dash.must.passPriority();

    // Steam stays on the item; the play simply spent the action point.
    expectFabCard(Bravo, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Bravo, cerebellumProcessorBlue).toHaveCounters(2, "steam");
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("AAA timing — having cranked this turn powers cranked-this-turn conditionals (CR 8.3.29)", () => {
    // Arrange — crank the processor first, then swing with Fast and Furious,
    // whose resolution ability reads "if you've cranked this turn".
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cerebellumProcessorBlue, fastAndFuriousRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act — item play spends the AP, crank refunds it, then the attack uses it.
    Bravo.must.play(cerebellumProcessorBlue);
    Bravo.must.passPriority();
    Dash.must.passPriority();
    Bravo.must.playAttack(fastAndFuriousRed);
    game.helpers.resolveRestOfCombat();

    // Assert — 3 power + 1 cranked bonus hits for 4; AP is fully spent.
    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(16); // 20 − (3 + 1)
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("AAA boundary — CR 8.3.29: cranking a card with no steam counter grants no action point", () => {
    // Arrange — a crank item with no steam-counter-granting ability enters with
    // zero steam counters. CR 8.3.29 grants an action point only by removing a
    // steam counter ("As this enters the arena, you may remove a steam counter
    // from it. If you do, gain an action point"); with no counter to remove,
    // the "if you do" grant must not fire.
    const crankNoCounters = itemTrainer({
      slug: "crank-no-counters",
      keywords: [{ name: "crank" }],
      cost: 0,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [crankNoCounters], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act — declare crank even though there is no steam counter to remove.
    Bravo.must.play(crankNoCounters, { crank: true });
    Bravo.must.passPriority();
    Dash.must.passPriority();

    // Assert — the item is in the arena, but with no counter to remove the
    // action-point grant must not fire. The play spent the turn's 1 AP → 0
    // (the bug would leave 1 AP from an unguarded grant).
    expectFabCard(Bravo, crankNoCounters).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveAP(0);
  });
});
