import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { moonWishRed } from "./moon-wish.ts";
import { sunKissBlue, sunKissRed, sunKissYellow } from "./sun-kiss.ts";

const variants = [
  { label: "red", card: sunKissRed, amount: 3 },
  { label: "yellow", card: sunKissYellow, amount: 2 },
  { label: "blue", card: sunKissBlue, amount: 1 },
] as const;

describe.each(variants)("Sun Kiss $label AAA", ({ card, amount }) => {
  it("happy: gains pitch-scaled life", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [card], actionPoints: 1, life: 20, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(card);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(20 + amount);
  });

  it("timing: after Moon Wish, draws and gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [moonWishRed, card],
        resourcePoints: 2,
        actionPoints: 2,
        life: 20,
        deckTop: [moonWishRed],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(moonWishRed, { modeIds: ["decline"] });
    game.passBoth();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Dash.play(card);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash)
      .toHaveLife(20 + amount)
      .toHaveAP(1)
      .toHaveHandCount(1);
  });
});
