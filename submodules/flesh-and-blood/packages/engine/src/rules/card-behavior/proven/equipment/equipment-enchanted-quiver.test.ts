/**
 * HNT252 Enchanted Quiver — Ranger Quiver.
 * Printed: Instant - Destroy this: Prevent the next 1 arcane damage that
 * would be dealt to you this turn. If there is a face-up arrow in your
 * arsenal, instead prevent the next 2.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, volticBoltRed } from "../../../fixtures.ts";
import { longShotBlue } from "../../../../../../cards/src/cards/actions/long-shot.ts";
import { enchantedQuiver } from "../../../../../../cards/src/cards/equipment/enchanted-quiver.ts";

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

describe("enchanted-quiver (HNT252)", () => {
  it("AAA: no face-up arrow → destroy-self prevents 1 arcane from Voltic Bolt", () => {
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
        weapon2: [enchantedQuiver],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    game.helpers.passPriorityTo(Bravo);
    Bravo.activate(enchantedQuiver);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("weapon2")).not.toContain(enchantedQuiver.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(enchantedQuiver.canonicalId);

    game.helpers.passPriorityTo(Dash);
    Dash.play(volticBoltRed, { target: Bravo.id });
    game.helpers.resolveUntilIdle();

    // Prevented 1 of 5 → 4 damage taken.
    expect(totalPrevented(game)).toBe(1);
    expect(Bravo.life()).toBe(LIFE - (BOLT_ARCANE - 1));
  });

  it("AAA: face-up arrow in arsenal → prevent 2 instead", () => {
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
        weapon2: [enchantedQuiver],
        arsenal: [{ card: longShotBlue, state: { faceDown: false } }],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    game.helpers.passPriorityTo(Bravo);
    Bravo.activate(enchantedQuiver);
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("graveyard")).toContain(enchantedQuiver.canonicalId);

    game.helpers.passPriorityTo(Dash);
    Dash.play(volticBoltRed, { target: Bravo.id });
    game.helpers.resolveUntilIdle();

    // Prevented 2 of 5 → 3 damage taken.
    expect(totalPrevented(game)).toBe(2);
    expect(Bravo.life()).toBe(LIFE - (BOLT_ARCANE - 2));
  });

  it("boundary: no quiver → no prevention (5 arcane = 5 life lost)", () => {
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
