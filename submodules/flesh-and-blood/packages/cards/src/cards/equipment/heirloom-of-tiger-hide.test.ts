import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { zenTamerOfPurpose } from "../heroes/zen-tamer-of-purpose.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { heirloomOfTigerHide } from "./heirloom-of-tiger-hide.ts";

/**
 * Heirloom of Tiger Hide — Mystic Ninja Chest d3, Cloaked + Blade Break.
 *
 * Printed: "Cloaked / While this is equipped face-down, at the start of your
 * turn, if you have exactly 1{h}, you may turn this face-up. / Blade Break"
 */
describe("Heirloom of Tiger Hide AAA", () => {
  it("happy: at exactly 1{h} the start-of-turn optional turns the cloaked piece face-up", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: zenTamerOfPurpose,
        life: 1,
        chest: [{ card: heirloomOfTigerHide, state: { faceDown: true } }],
        hand: [],
        deck: 6,
      },
    );
    const Zen = game.as(zenTamerOfPurpose);
    expectFabCard(Zen, heirloomOfTigerHide).toBeFaceDown();

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Zen, heirloomOfTigerHide).toBeFaceUp();
    expectFabCard(Zen, heirloomOfTigerHide).toBeIn("chest");
  });

  it("boundary: declining the optional leaves the piece equipped face-down", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: zenTamerOfPurpose,
        life: 1,
        chest: [{ card: heirloomOfTigerHide, state: { faceDown: true } }],
        hand: [],
        deck: 6,
      },
    );
    const Zen = game.as(zenTamerOfPurpose);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Zen, heirloomOfTigerHide).toBeFaceDown();
    expectFabCard(Zen, heirloomOfTigerHide).toBeIn("chest");
  });

  it("timing: a face-up seat that defends is destroyed by Blade Break after combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: zenTamerOfPurpose,
        life: 20,
        chest: [{ card: heirloomOfTigerHide, state: { faceUp: true } }],
        hand: [],
        deck: 6,
      },
    );
    const Zen = game.as(zenTamerOfPurpose);

    game.as(dash).attackWith(snatchRed);
    Zen.defendWith(heirloomOfTigerHide);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Zen).toHaveLife(19); // snatch 4 − 3
    expectFabCard(Zen, heirloomOfTigerHide).toBeIn("graveyard");
  });
});
