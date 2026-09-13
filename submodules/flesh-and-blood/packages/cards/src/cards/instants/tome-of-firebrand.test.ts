import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { roninRenegadeBlue } from "../actions/ronin-renegade.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeOfFirebrandRed } from "./tome-of-firebrand.ts";

describe("Tome of Firebrand (UPR089) AAA", () => {
  it("happy: with 4 Draconic chain links, draws 2", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [
          roninRenegadeBlue,
          roninRenegadeBlue,
          roninRenegadeBlue,
          roninRenegadeBlue,
          tomeOfFirebrandRed,
        ],
        deckTop: [nimblismBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(roninRenegadeBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(roninRenegadeBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(roninRenegadeBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(roninRenegadeBlue);
    game.toReaction("attacker");
    Fai.play(tomeOfFirebrandRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Fai, nimblismBlue).toBeIn("hand");
    expectFabCard(Fai, snatchRed).toBeIn("hand");
    expectFabCard(Fai, tomeOfFirebrandRed).toBeIn("graveyard");
  });

  it("boundary: with no Draconic chain links the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [tomeOfFirebrandRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    expectFabUnplayable(
      () => Fai.play(tomeOfFirebrandRed),
      /play condition is not satisfied|couldn't be played/i,
    );
    expectFabCard(Fai, tomeOfFirebrandRed).toBeIn("hand");
  });

  it("timing: a Generic chain does not unlock the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, snatchRed, snatchRed, snatchRed, tomeOfFirebrandRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(snatchRed);
    game.advanceCombatTo("resolution");
    expectFabUnplayable(
      () => Fai.play(tomeOfFirebrandRed),
      /play condition is not satisfied|couldn't be played/i,
    );
    expectFabCard(Fai, tomeOfFirebrandRed).toBeIn("hand");
  });
});
