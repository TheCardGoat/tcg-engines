import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { richterScale } from "./richter-scale.ts";

describe("Richter Scale (MPG006) AAA", () => {
  it("happy: destroy this to create 2 Seismic Surge tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [richterScale],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, richterScale).toHaveKeyword("battleworn");
    Bravo.must.activate(richterScale);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, richterScale).toBeIn("graveyard");
    expect(Bravo.zone("arena").filter((id) => id === "token:seismic-surge")).toHaveLength(2);
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("boundary: 0 action points cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [richterScale],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );

    game.as(bravo).expectActivationRejected(richterScale);
    expectFabCard(game.as(bravo), richterScale).toBeIn("chest");
    expect(game.as(bravo).zone("arena")).not.toContain("token:seismic-surge");
  });

  it("timing: Battleworn puts a -1{d} counter after this defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [richterScale],
        hand: [],
        deck: 6,
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(richterScale);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, richterScale).toBeIn("chest");
    expectFabCard(Bravo, richterScale).toHaveDefenseCounters(-1);
    expectFabPlayer(Bravo).toHaveLife(17);
  });
});
