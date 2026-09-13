import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viseraiBetweenWorlds } from "../heroes/viserai-between-worlds.ts";
import { nimblismRed } from "./nimblism.ts";
import { nimblismYellow } from "./nimblism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { douseInRunebloodRed } from "./douse-in-runeblood.ts";

describe("Douse in Runeblood (HNT254) AAA", () => {
  it("happy: three non-attack actions create 3 Runechants and grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiBetweenWorlds,
        hand: [nimblismRed, nimblismYellow, nimblismBlue, douseInRunebloodRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiBetweenWorlds);

    Viserai.play(nimblismRed);
    game.untilIdle();
    Viserai.play(nimblismYellow);
    game.untilIdle();
    Viserai.play(nimblismBlue);
    game.untilIdle();
    Viserai.playAttack(douseInRunebloodRed);

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 3);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: two non-attack actions create 2 Runechants and do not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiBetweenWorlds,
        hand: [nimblismRed, nimblismYellow, douseInRunebloodRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiBetweenWorlds);

    Viserai.play(nimblismRed);
    game.untilIdle();
    Viserai.play(nimblismYellow);
    game.untilIdle();
    Viserai.playAttack(douseInRunebloodRed);

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: go again refunds AP after the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiBetweenWorlds,
        hand: [nimblismRed, nimblismYellow, nimblismBlue, douseInRunebloodRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiBetweenWorlds);

    Viserai.play(nimblismRed);
    game.untilIdle();
    Viserai.play(nimblismYellow);
    game.untilIdle();
    Viserai.play(nimblismBlue);
    game.untilIdle();
    Viserai.playAttack(douseInRunebloodRed);
    game.closeCombat();

    expectFabCard(Viserai, douseInRunebloodRed).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveAP(1);
  });
});
