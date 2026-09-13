/**
 * HNT247 Tremorshield Sabatons — Guardian Legs d1 bladeBreak.
 * Printed: Instant - Destroy this: Prevent the next 1 arcane damage that
 * would be dealt to you this turn. If you've controlled a Seismic Surge
 * token this turn, instead prevent the next 2.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, volticBoltRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { tremorshieldSabatons } from "../../../../../../cards/src/cards/equipment/tremorshield-sabatons.ts";

const LIFE = 20;
/** Voltic Bolt (ARC147) deals 5 arcane. */
const BOLT_ARCANE = 5;

function totalPrevented(game: ReturnType<typeof FabTestEngine.start>): number {
  let total = 0;
  for (const e of game.committedEvents()) {
    if (e.name !== "prevent" || !e.data || !("preventedAmount" in e.data)) continue;
    total += Number(e.data.preventedAmount) || 0;
  }
  return total;
}

describe("tremorshield-sabatons (HNT247)", () => {
  it("AAA: without Surge, destroy-self prevents 1 arcane from Voltic Bolt", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [volticBoltRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
        life: LIFE,
      },
      {
        hero: bravo,
        legs: [tremorshieldSabatons],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Dash is active. Bravo Instant-activates Sabatons on his priority.
    game.helpers.passPriorityTo(Bravo);
    Bravo.activate(tremorshieldSabatons);
    game.helpers.resolveUntilIdle();

    // Cost: destroy-self → legs empty, GY.
    expect(Bravo.zone("legs")).not.toContain(tremorshieldSabatons.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(tremorshieldSabatons.canonicalId);

    // Dash resolves Voltic Bolt (5 arcane) at Bravo.
    game.helpers.passPriorityTo(Dash);
    Dash.play(volticBoltRed, { target: Bravo.id });
    game.helpers.resolveUntilIdle();

    // Prevented 1 of 5 → 4 damage taken.
    expect(totalPrevented(game)).toBe(1);
    expect(Bravo.life()).toBe(LIFE - (BOLT_ARCANE - 1));
  });

  it("AAA: controlling a Seismic Surge token this turn → prevent 2", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [volticBoltRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
        life: LIFE,
      },
      {
        hero: bravo,
        legs: [tremorshieldSabatons],
        arena: [fabToken("seismic-surge")],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    game.helpers.passPriorityTo(Bravo);
    Bravo.activate(tremorshieldSabatons);
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("graveyard")).toContain(tremorshieldSabatons.canonicalId);

    game.helpers.passPriorityTo(Dash);
    Dash.play(volticBoltRed, { target: Bravo.id });
    game.helpers.resolveUntilIdle();

    // Prevented 2 of 5 → 3 damage taken.
    expect(totalPrevented(game)).toBe(2);
    expect(Bravo.life()).toBe(LIFE - (BOLT_ARCANE - 2));
  });

  it("boundary: no Sabatons → no prevention (5 arcane = 5 life lost)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [volticBoltRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
        life: LIFE,
      },
      {
        hero: bravo,
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.play(volticBoltRed, { target: Bravo.id });
    game.helpers.resolveUntilIdle();

    expect(totalPrevented(game)).toBe(0);
    expect(Bravo.life()).toBe(LIFE - BOLT_ARCANE);
  });
});
