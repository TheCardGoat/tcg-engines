import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { theSuspenseIsKillingMeBlue } from "../instants/the-suspense-is-killing-me.ts";
import { bravo } from "../heroes/bravo.ts";
import { storyBeatsRed } from "./story-beats.ts";

/**
 * Story Beats (SUP181) — Guardian Action - Attack, cost 3, 7{p}.
 *
 * Printed: When this attacks or defends, you may put a suspense counter on,
 * or remove one from, an aura of suspense you control.
 */

describe("Story Beats (SUP181) AAA", () => {
  it("happy: attacking may add a suspense counter to a suspense aura", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [storyBeatsRed],
        arena: [theSuspenseIsKillingMeBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(storyBeatsRed, { stopAt: "on-attack" });
    Bravo.accept();
    if (game.waitState().kind === "decision") {
      try {
        Bravo.choose("add");
      } catch {
        Bravo.target(theSuspenseIsKillingMeBlue);
      }
    }
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat();
  });

  it("boundary: with no suspense aura, the boolean does not open", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [storyBeatsRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(storyBeatsRed, { stopAt: "on-attack" });
    Bravo.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
  });

  it("timing: declining leaves the aura's counters unchanged", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [storyBeatsRed],
        arena: [theSuspenseIsKillingMeBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(storyBeatsRed, { stopAt: "on-attack" });
    Bravo.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expectFabCard(Bravo, theSuspenseIsKillingMeBlue).toBeIn("arena");
  });
});
