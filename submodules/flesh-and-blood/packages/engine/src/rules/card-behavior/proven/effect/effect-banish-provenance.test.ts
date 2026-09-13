/**
 * CR 8.5.1a / 8.5.1b — banish provenance.
 *
 * 8.5.1a: putting an object into the banished zone because of a rule/effect
 * OTHER than banish is NOT considered banishing. The engine encodes this via
 * the committed EVENT NAME: a `banish` effect emits `name:"banish"`, while a
 * `move-card` to the banished zone emits `name:"move-zone"`. Triggers keyed on
 * `name:"banish"` therefore only fire on the banish action (the provenance
 * distinction).
 *
 * 8.5.1b: the banish event carries `reason:"banish"`; a move-card-to-banished
 * carries a different reason. Both reach the banished zone but are
 * distinguishable in the journal.
 *
 * Real banish producer: Tome of Pandemonium (PEN277). Move-card-to-banished
 * producer: a synthetic hitTrainer (no printed card moves a card to banished
 * via move-card — justified per test-trainers.ts POLICY).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, tomeOfPandemoniumYellow } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

describe("CR 8.5.1a/b — banish provenance (event name + reason)", () => {
  it("a banish EFFECT emits name:'banish' with reason:'banish' (Tome of Pandemonium)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tomeOfPandemoniumYellow], deck: 6, resourcePoints: 1 },
      { hero: dash, deck: 6 },
    );
    game.as(bravo).play(tomeOfPandemoniumYellow);
    game.passBoth();

    // CR 8.5.1: the banish effect emits a `banish` event (not `move-zone`)
    // with reason "banish" — this is the provenance triggers key on.
    const banishEvents = game.committedEvents().filter((e) => e.name === "banish");
    expect(banishEvents.length).toBeGreaterThan(0);
    expect(banishEvents.some((e) => e.data.to === "banished" && e.data.reason === "banish")).toBe(
      true,
    );
    // Cards did reach the banished zone.
    expect(game.as(bravo).zone("banished").length).toBeGreaterThan(0);
  });

  it("a move-card TO the banished zone emits name:'move-zone' (NOT 'banish') — 8.5.1a", () => {
    // No printed card moves a card to banished via move-card; a trainer is the
    // justified producer for this provenance-negative.
    const attack = hitTrainer({
      slug: "fx-move-to-banished",
      power: 4,
      effect: { type: "move-card", target: { selector: "self" }, to: { zone: "banished" } },
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    // CR 8.5.1a: moving to the banished zone via move-card is NOT a banish —
    // the event is `move-zone`, never `banish`, so a name:"banish" trigger
    // would not fire.
    const toBanished = game
      .committedEvents()
      .filter((e) => e.name === "move-zone" && e.data.to === "banished");
    expect(toBanished.length).toBeGreaterThan(0);
    expect(game.committedEvents().some((e) => e.name === "banish")).toBe(false);
  });
});
