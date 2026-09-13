import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { dunebreakerCenipaiBlue } from "../actions/dunebreaker-cenipai.ts";
import { demolitionCrewRed } from "../actions/demolition-crew.ts";
import { snatchRed } from "../actions/snatch.ts";
import { phantomTidemawBlue } from "./phantom-tidemaw.ts";

describe("Phantom Tidemaw (EVO244) AAA", () => {
  it("happy: destroying an Illusionist card you control puts a +1{p} counter on this", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantomTidemawBlue, dunebreakerCenipaiBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [demolitionCrewRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(phantomTidemawBlue);
    game.untilIdle();
    Prism.attackWith(dunebreakerCenipaiBlue);
    game.as(dash).defendWith(demolitionCrewRed);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Prism, dunebreakerCenipaiBlue).toBeIn("graveyard");
    expectFabCard(Prism, phantomTidemawBlue).toBeIn("arena").toHaveCounters(1);
  });

  it("boundary: destroying a non-Illusionist attack does not add a +1{p} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantomTidemawBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(phantomTidemawBlue);
    game.untilIdle();
    Prism.attackWith(snatchRed);
    game.closeCombat();

    expectFabCard(Prism, snatchRed).toBeIn("graveyard");
    expectFabCard(Prism, phantomTidemawBlue).toBeIn("arena").toHaveCounters(0);
  });

  it("timing: this has Ward 1 in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantomTidemawBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(phantomTidemawBlue);
    game.untilIdle();

    expectFabCard(Prism, phantomTidemawBlue).toBeIn("arena").toHaveKeyword("ward");
    expectFabPlayer(Prism).toHaveAP(1);
  });
});
