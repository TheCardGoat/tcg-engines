import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { scurvStowaway } from "../heroes/scurv-stowaway.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { snatchRed } from "./snatch.ts";
import { treasureIsland } from "../macros/treasure-island.ts";
import { thievNVarmintsRed } from "./thiev-n-varmints.ts";

/**
 * Thiev'n Varmints (SEA172) — Pirate Action - Attack, cost 0, 4{p}.
 *
 * Printed: When this attacks, you may remove a gold counter from Treasure
 * Island. If you do and you are a Thief, create a Gold token.
 */

describe("Thiev'n Varmints (SEA172) AAA", () => {
  it("happy: after Treasure Island already has a gold counter, a Thief may create Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        macros: [treasureIsland],
        hand: [snatchRed, thievNVarmintsRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Scurv = game.as(scurvStowaway);

    Scurv.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed", optionals: "decline" });
    Scurv.playAttack(thievNVarmintsRed, { stopAt: "on-attack" });
    Scurv.accept();
    Scurv.target(treasureIsland);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(Scurv).toHaveTokenCount("gold", 1);
  });

  it("boundary: without Treasure Island this still attacks at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [thievNVarmintsRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(thievNVarmintsRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 0);
  });

  it("timing: declining the remove creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        macros: [treasureIsland],
        hand: [snatchRed, thievNVarmintsRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Scurv = game.as(scurvStowaway);

    Scurv.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed", optionals: "decline" });
    Scurv.playAttack(thievNVarmintsRed, { stopAt: "on-attack" });
    Scurv.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expectFabPlayer(Scurv).toHaveTokenCount("gold", 0);
  });
});
