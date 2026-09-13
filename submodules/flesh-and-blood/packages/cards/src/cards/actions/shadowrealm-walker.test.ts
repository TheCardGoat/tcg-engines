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
import { shadowrealmWalkerRed } from "./shadowrealm-walker.ts";
import { snatchRed } from "./snatch.ts";

describe("Shadowrealm Walker AAA", () => {
  it("happy: banishing a Shadow card from hand creates a Gate token", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [shadowrealmWalkerRed, ghostlyVisitRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(shadowrealmWalkerRed, { stopAt: "on-attack" });
    Chane.accept();
    Chane.target(ghostlyVisitRed);
    game.advanceUntil({ stopAt: "defend" });
    expectFabCard(Chane, ghostlyVisitRed).toBeBanished();
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 1);
  });

  it("boundary: declining the banish keeps printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [shadowrealmWalkerRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(shadowrealmWalkerRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    expectFabCard(Chane, snatchRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 0);
  });
});
