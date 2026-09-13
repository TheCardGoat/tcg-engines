import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { nuu } from "../heroes/nuu.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { heirloomOfSnakeHide } from "./heirloom-of-snake-hide.ts";

/**
 * Heirloom of Snake Hide (MST005) — Mystic Assassin Chest d2, Cloaked +
 * Battleworn.
 *
 * Printed: "Cloaked / While this is equipped face-down, at the start of your
 * turn, if you have exactly 1{h}, you may turn this face-up. / Battleworn"
 */
describe("Heirloom of Snake Hide (MST005) AAA", () => {
  it("happy: at exactly 1{h} the start-of-turn optional turns the cloaked piece face-up", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: nuu,
        life: 1,
        chest: [{ card: heirloomOfSnakeHide, state: { faceDown: true } }],
        hand: [],
        deck: 6,
      },
    );
    const Nuu = game.as(nuu);
    expectFabCard(Nuu, heirloomOfSnakeHide).toBeFaceDown();

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Nuu, heirloomOfSnakeHide).toBeFaceUp();
    expectFabCard(Nuu, heirloomOfSnakeHide).toBeIn("chest");
  });

  it("boundary: at 2{h} the exactly-1 gate keeps the trigger silent and the piece face-down", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: nuu,
        life: 2,
        chest: [{ card: heirloomOfSnakeHide, state: { faceDown: true } }],
        hand: [],
        deck: 6,
      },
    );
    const Nuu = game.as(nuu);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Nuu, heirloomOfSnakeHide).toBeFaceDown();
    expectFabCard(Nuu, heirloomOfSnakeHide).toBeIn("chest");
  });

  it("timing: a face-up seat defends for its printed 2{d} and Battleworn marks −1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: nuu,
        life: 20,
        chest: [{ card: heirloomOfSnakeHide, state: { faceUp: true } }],
        hand: [],
        deck: 6,
      },
    );
    const Nuu = game.as(nuu);

    game.as(dash).attackWith(snatchRed);
    Nuu.defendWith(heirloomOfSnakeHide);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Nuu).toHaveLife(18); // snatch 4 − 2
    expectFabCard(Nuu, heirloomOfSnakeHide).toHaveDefenseCounters(-1);
    expectFabCard(Nuu, heirloomOfSnakeHide).toBeIn("chest");
  });
});
