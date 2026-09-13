import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { shittyXmasPresentYellow } from "./shitty-xmas-present.ts";

/**
 * Shitty Xmas Present (LGS099) — Generic Action.
 * Printed: Put a Cracked Bauble from outside the game on top of target hero's deck.
 */

describe("Shitty Xmas Present (LGS099) AAA", () => {
  it("happy: puts a Cracked Bauble on top of the targeted hero's deck", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [shittyXmasPresentYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(shittyXmasPresentYellow, { target: Bravo.id });
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("deck").at(-1)).toBe(crackedBaubleYellow.canonicalId);
    expectFabCard(Dash, shittyXmasPresentYellow).toBeIn("graveyard");
    expect(Dash.zone("deck")).not.toContain(crackedBaubleYellow.canonicalId);
  });

  it("boundary: it cannot be played without an action point", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [shittyXmasPresentYellow], actionPoints: 0, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() =>
      game.as(dash).play(shittyXmasPresentYellow, { target: game.as(bravo).id }),
    ).toThrow();
    expectFabCard(game.as(dash), shittyXmasPresentYellow).toBeIn("hand");
  });

  it("timing: targeting yourself puts the Bauble on your own deck", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [shittyXmasPresentYellow], actionPoints: 1, life: 20, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(shittyXmasPresentYellow, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("deck").at(-1)).toBe(crackedBaubleYellow.canonicalId);
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
    expect(game.combat()).toBeNull();
  });
});
