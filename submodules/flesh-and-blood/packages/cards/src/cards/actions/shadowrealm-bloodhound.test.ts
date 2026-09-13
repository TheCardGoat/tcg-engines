import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { ghostlyVisitRed } from "./ghostly-visit.ts";
import { shadowrealmBloodhoundRed } from "./shadowrealm-bloodhound.ts";
import { snatchRed } from "./snatch.ts";

describe("Shadowrealm Bloodhound AAA", () => {
  it("happy: banishing a Shadow card from hand grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [shadowrealmBloodhoundRed, ghostlyVisitRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(shadowrealmBloodhoundRed, { stopAt: "on-attack" });
    Chane.accept();
    Chane.target(ghostlyVisitRed);
    game.advanceUntil({ stopAt: "defend" });
    expectFabCard(Chane, ghostlyVisitRed).toBeBanished();
    expectCombat(game).toHaveKeyword("go-again").toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Chane).toHaveAP(1);
  });

  it("boundary: banishing a non-Shadow card does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [shadowrealmBloodhoundRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(shadowrealmBloodhoundRed, { stopAt: "on-attack" });
    Chane.accept();
    Chane.target(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectFabCard(Chane, snatchRed).toBeBanished();
    expectCombat(game).notToHaveKeyword("go-again").toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Chane).toHaveAP(0);
  });
});
