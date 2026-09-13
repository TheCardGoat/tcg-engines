import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { ghostlyVisitRed } from "./ghostly-visit.ts";
import { shadowrealmRipperRed } from "./shadowrealm-ripper.ts";
import { snatchRed } from "./snatch.ts";

describe("Shadowrealm Ripper AAA", () => {
  it("happy: banishing a Shadow card from hand gives this +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [shadowrealmRipperRed, ghostlyVisitRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(shadowrealmRipperRed, { stopAt: "on-attack" });
    Chane.accept();
    Chane.target(ghostlyVisitRed);
    game.advanceUntil({ stopAt: "defend" });
    expectFabCard(Chane, ghostlyVisitRed).toBeBanished();
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: banishing a non-Shadow card keeps printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [shadowrealmRipperRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(shadowrealmRipperRed, { stopAt: "on-attack" });
    Chane.accept();
    Chane.target(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectFabCard(Chane, snatchRed).toBeBanished();
    expectCombat(game).toHaveAttackPower(5);
  });
});
