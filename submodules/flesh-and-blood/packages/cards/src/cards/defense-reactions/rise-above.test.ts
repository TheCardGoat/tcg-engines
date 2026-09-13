import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { riseAboveRed } from "./rise-above.ts";

describe("Rise Above family AAA", () => {
  it("can pay its cost by putting a hand card on top of the deck", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [riseAboveRed, nimblismBlue], resourcePoints: 0, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Bravo.play(riseAboveRed, { modeIds: ["pay"] });
    game.passBoth();
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("deck").at(-1)).toBe(nimblismBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("keeps the extra card when the alternative cost is declined", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [riseAboveRed, nimblismBlue], resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Bravo.play(riseAboveRed, { modeIds: ["decline"] });
    game.passBoth();
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
  });
});
