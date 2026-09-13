import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { autosaveScriptBlue } from "./autosave-script.ts";

describe("Autosave Script (EVO098) AAA", () => {
  it("happy: a hitting Mechanologist attack action is put on the bottom of its owner's deck", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: autosaveScriptBlue, state: { steamCounters: 1 } }],
        hand: [zeroToSixtyRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(zeroToSixtyRed);
    game.closeCombat();

    expect(Teklo.zone("deck")).toContain(zeroToSixtyRed.canonicalId);
  });

  it("boundary: a Generic attack action is not put on the bottom on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: autosaveScriptBlue, state: { steamCounters: 1 } }],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(brutalAssaultBlue);
    game.closeCombat();

    expectFabCard(Teklo, brutalAssaultBlue).toBeIn("graveyard");
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: autosaveScriptBlue, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, autosaveScriptBlue).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, autosaveScriptBlue).toBeIn("arena");
  });
});
