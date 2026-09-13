import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  seedResourcePoints,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { savageSwingRed } from "../actions/savage-swing.ts";
import { savageFeastRed } from "../actions/savage-feast.ts";
import { alphaRampageRed } from "../actions/alpha-rampage.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snagBlue } from "../instants/snag.ts";
import { chiefRukUtan } from "./chief-ruk-utan.ts";

/**
 * Chief Ruk'utan (LGS145) — Brute Mentor.
 * Printed: "While Ruk'utan is face-down in arsenal, at the start of your
 * turn, you may turn him face-up. While Ruk'utan is face-up in arsenal,
 * whenever you play a card with 6 or more {p}, intimidate and put a lesson
 * counter on him. Then if there are 2 or more lesson counters on Ruk'utan,
 * banish him, search your deck for Alpha Rampage, put it face-up in arsenal,
 * and shuffle."
 */
describe("Chief Ruk'utan (LGS145) AAA", () => {
  it("happy: two 6+{p} plays teach Ruk'utan twice, then Alpha Rampage is face-up in arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        arsenal: [chiefRukUtan],
        hand: [savageSwingRed, savageFeastRed, snagBlue, nimblismBlue],
        // Enough filler sits above Alpha for the EOT draw-to-intellect and
        // Brute discard costs between the two 6+{p} plays.
        deck: [alphaRampageRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [snagBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    // Turn 1 passes quietly; at turn 2 the start-phase flip is accepted.
    Rhinar.endTurn();
    game.untilIdle({ optionals: "decline" });
    Dash.endTurn();
    game.untilIdle({ optionals: "accept" });
    seedResourcePoints(game, 1, Rhinar);

    // First 6+{p} play: intimidate + one lesson counter.
    Rhinar.playAttack(savageSwingRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Rhinar, chiefRukUtan).toHaveCounters(1, "lesson");
    expect(Dash.zone("banished").length).toBeGreaterThanOrEqual(1);

    // Second 6+{p} play on the next turn: counter 2 banishes him and
    // fetches Alpha Rampage face-up into arsenal. mayFail search is up-to-1,
    // so take the unique deck match.
    Rhinar.endTurn();
    game.untilIdle({ optionals: "decline" });
    Dash.endTurn();
    game.untilIdle({ optionals: "decline" });
    seedResourcePoints(game, 1, Rhinar);
    Rhinar.playAttack(savageFeastRed, { entityTargets: "maximum" });
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Rhinar.cardsIn("banished", chiefRukUtan)).toHaveLength(1);
    expectFabCard(Rhinar, alphaRampageRed).toBeIn("arsenal");
    expectFabCard(Rhinar, alphaRampageRed).toBeFaceUp();
    expect(Rhinar.cardsIn("deck", alphaRampageRed)).toHaveLength(0);
  });

  it("boundary: declining the flip keeps Ruk'utan silent on a 6+{p} play", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        arsenal: [chiefRukUtan],
        hand: [savageSwingRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.endTurn();
    game.untilIdle({ optionals: "decline" });
    Dash.endTurn();
    game.untilIdle({ optionals: "decline" });
    seedResourcePoints(game, 1, Rhinar);

    Rhinar.playAttack(savageSwingRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Rhinar, chiefRukUtan).toBeIn("arsenal");
    expectFabCard(Rhinar, chiefRukUtan).toHaveCounters(0, "lesson");
    expect(Dash.zone("banished").length).toBe(0);
    expectFabPlayer(Dash).toHaveLife(13);
  });
});
