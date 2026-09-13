import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  seedResourcePoints,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { seedsOfAgonyRed, seedsOfAgonyYellow } from "../actions/seeds-of-agony.ts";
import { riftBindRed } from "../actions/rift-bind.ts";
import { snagBlue } from "../instants/snag.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { lordSutcliffe } from "./lord-sutcliffe.ts";

/**
 * Lord Sutcliffe (CHN002) — Runeblade Mentor.
 * Printed: "At the start of your turn, if Sutcliffe is face-down in your
 * arsenal, you may turn him face-up. While Sutcliffe is face-up in arsenal,
 * whenever you play a non-attack action card, deal 1 arcane damage to each
 * hero and put a lesson counter on Sutcliffe for each damage dealt this way.
 * Then if there are 3 or more lesson counters on Sutcliffe, banish him,
 * search your deck for a specialization card, put it face-up into your
 * arsenal, and shuffle."
 */
describe("Lord Sutcliffe (CHN002) AAA", () => {
  it("happy: two non-attack actions ping each hero and teach Sutcliffe to his threshold", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arsenal: [lordSutcliffe],
        hand: [seedsOfAgonyRed, seedsOfAgonyYellow, snagBlue, nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Vise = game.as(viserai);
    const Dash = game.as(dash);

    Vise.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "accept" });

    // First non-attack action: 1 arcane to each hero, two lesson counters.
    Vise.play(seedsOfAgonyRed);
    game.helpers.untilIdle();
    expectFabPlayer(Vise).toHaveLife(19);
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Vise, lordSutcliffe).toHaveCounters(2, "lesson");

    // Second non-attack action: counters reach 3+ and Sutcliffe is banished.
    Vise.play(seedsOfAgonyYellow);
    game.helpers.untilIdle();
    expectFabPlayer(Vise).toHaveLife(18);
    expectFabPlayer(Dash).toHaveLife(18);
    expect(Vise.cardsIn("banished", lordSutcliffe)).toHaveLength(1);
  });

  it("boundary: declining the flip keeps Sutcliffe silent on a non-attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arsenal: [lordSutcliffe],
        hand: [seedsOfAgonyRed, snagBlue, nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Vise = game.as(viserai);
    const Dash = game.as(dash);

    Vise.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "decline" });

    Vise.play(seedsOfAgonyRed);
    game.helpers.untilIdle();

    expectFabPlayer(Vise).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Vise, lordSutcliffe).toBeIn("arsenal");
    expectFabCard(Vise, lordSutcliffe).toHaveCounters(0, "lesson");
  });

  it("boundary: an attack action card never teaches Sutcliffe", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arsenal: [lordSutcliffe],
        hand: [riftBindRed, snagBlue, nimblismBlue],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Vise = game.as(viserai);
    const Dash = game.as(dash);

    Vise.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "accept" });
    seedResourcePoints(game, 1, Vise);

    Vise.playAttack(riftBindRed);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    // Rift Bind's own 3 attack damage lands; no Sutcliffe arcane pings.
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Vise, lordSutcliffe).toBeIn("arsenal");
    expectFabCard(Vise, lordSutcliffe).toHaveCounters(0, "lesson");
  });
});
