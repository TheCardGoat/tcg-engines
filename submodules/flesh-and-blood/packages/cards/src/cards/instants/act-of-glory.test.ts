import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { cleansingLightRed } from "../actions/cleansing-light.ts";
import { snatchRed } from "../actions/snatch.ts";
import { actOfGloryRed } from "./act-of-glory.ts";

describe("Act of Glory family AAA", () => {
  it("happy: destroying the red aura arms +6 power on the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [actOfGloryRed],
        hand: [cleansingLightRed, snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(cleansingLightRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: actOfGloryRed.canonicalId });
    expectFabCard(Bravo, actOfGloryRed).toBeIn("graveyard");

    Bravo.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(10);
  });
});
