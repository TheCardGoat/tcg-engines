import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "./snatch.ts";
import { edgeAheadRed } from "./edge-ahead.ts";

/**
 * Edge Ahead (HVY124) — Warrior Action, cost 1, 3{d}, go again.
 *
 * Printed: "Your next Warrior attack this turn gets +3{p} and \"When this
 * attacks a hero, you may wager an Agility token with them.\"
 * Go again"
 */

describe("edge-ahead family AAA", () => {
  it("happy: the next Warrior attack this turn gets +3{p} and may wager Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [edgeAheadRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.play(edgeAheadRed);
    game.passBoth();
    Kassai.activateAttack(cintariSaber, { stopAt: "on-attack" });
    Kassai.accept();
    game.advanceUntil({ stopAt: "defend" });

    // Cintari Saber printed 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, edgeAheadRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [edgeAheadRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.play(edgeAheadRed);
    game.passBoth();
    Kassai.must.playAttack(snatchRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [edgeAheadRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    expectFabPlayer(Kassai).toHaveAP(1);
    Kassai.play(edgeAheadRed);
    game.passBoth();
    expectFabPlayer(Kassai).toHaveAP(1);
  });
});
