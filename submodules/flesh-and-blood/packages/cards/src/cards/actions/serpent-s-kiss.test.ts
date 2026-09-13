import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { homageToAncestorsBlue } from "../instants/homage-to-ancestors.ts";
import { nimblismBlue } from "./nimblism.ts";
import { serpentSKissBlue } from "./serpent-s-kiss.ts";

describe("Serpent's Kiss (PEN262) AAA", () => {
  it("happy: when this attacks without transcend, create Fang Strike or Slither in hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [serpentSKissBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(serpentSKissBlue, { stopAt: "on-attack" });
    Bravo.choose("option-1");

    expect(Bravo.zone("hand").some((id) => id.startsWith("token:slither"))).toBe(true);
    expect(Bravo.zone("hand").some((id) => id.startsWith("token:fang-strike"))).toBe(false);
  });

  it("boundary: after transcend this turn, attacking creates both Fang Strike and Slither", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue, homageToAncestorsBlue, serpentSKissBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Bravo.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(serpentSKissBlue, { stopAt: "on-attack" });

    expect(Bravo.zone("hand").some((id) => id.startsWith("token:slither"))).toBe(true);
    expect(Bravo.zone("hand").some((id) => id.startsWith("token:fang-strike"))).toBe(true);
  });

  it("timing: when this hits a hero, look at the top 2 of their deck and banish 1", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [serpentSKissBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deckTop: [nimblismBlue, homageToAncestorsBlue], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(serpentSKissBlue, { stopAt: "on-attack" });
    Bravo.choose("option-1");
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(19);
    expect(Dash.cardsIn("deck", homageToAncestorsBlue).length).toBe(1);
    expect(Dash.cardsIn("deck", nimblismBlue).length).toBe(1);
  });
});
