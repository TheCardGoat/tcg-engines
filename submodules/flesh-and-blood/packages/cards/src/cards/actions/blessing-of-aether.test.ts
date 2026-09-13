import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "./voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { blessingOfAetherRed } from "./blessing-of-aether.ts";

describe("Blessing of Aether (DYN200) AAA", () => {
  it("happy: next arcane card this turn deals that much plus 3", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: kano,
        arena: [blessingOfAetherRed],
        hand: [volticBoltRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        life: 15,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Dash.endTurn();
    game.untilIdle();
    expectFabCard(Kano, blessingOfAetherRed).toBeIn("graveyard");

    Kano.play(volticBoltRed, {
      pitch: [nimblismBlue, nimblismBlue],
      target: Dash.id,
    });
    game.untilIdle();
    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: a non-arcane attack is not amped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: kano,
        arena: [blessingOfAetherRed],
        hand: [snatchRed],
        life: 15,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Dash.endTurn();
    game.untilIdle();
    Kano.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: kano, arena: [blessingOfAetherRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(kano).endTurn();
    game.untilIdle();
    expectFabCard(game.as(kano), blessingOfAetherRed).toBeIn("arena");
  });
});
