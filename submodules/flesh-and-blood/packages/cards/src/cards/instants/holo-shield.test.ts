import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { holoShieldBlue, holoShieldRed, holoShieldYellow } from "./holo-shield.ts";

const variants = [
  { label: "Holo Shield Red (OMN030)", card: holoShieldRed, amount: 4 },
  { label: "Holo Shield Yellow (OMN031)", card: holoShieldYellow, amount: 3 },
  { label: "Holo Shield Blue (OMN032)", card: holoShieldBlue, amount: 2 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, amount }) => {
  it("happy: a holo counter makes the ward shield apply", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        arena: [{ card, state: { holoCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expectFabCard(Bravo, card).toBeIn("arena").toHaveKeyword("ward");
    Bravo.endTurn();
    Dash.playAttack(snatchRed);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveLife(20 - (4 - amount));
  });

  it("boundary: without a holo counter the ward shield is one", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(card);
    game.untilIdle();
    Bravo.endTurn();
    Dash.playAttack(snatchRed);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveLife(17);
  });

  it("timing: the aura remains in the arena after play", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(card);
    game.untilIdle();

    expectFabCard(Bravo, card).toBeIn("arena").toHaveKeyword("ward");
  });
});
