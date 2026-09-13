import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";
import { opalAmuletBlue } from "./opal-amulet.ts";

describe("Opal Amulet (SEA192) AAA", () => {
  it("happy: Instant destroy this to Opt 2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [opalAmuletBlue],
        actionPoints: 1,
        deck: [wreckerRompRed, nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(opalAmuletBlue, { optBottom: 2 });
    game.untilIdle({ entityTargets: "minimum", optBottom: 2 });

    expectFabCard(Bravo, opalAmuletBlue).toBeIn("graveyard");
    expect(Bravo.zone("deck").at(-1)).toBe(wreckerRompRed.canonicalId);
  });

  it("boundary: without activation the deck order is unchanged", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [opalAmuletBlue],
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
    expectFabCard(Bravo, opalAmuletBlue).toBeIn("arena");
  });

  it("timing: Instant Opt is not combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [opalAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).activate(opalAmuletBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectCombat(game).toBeClosed();
  });
});
