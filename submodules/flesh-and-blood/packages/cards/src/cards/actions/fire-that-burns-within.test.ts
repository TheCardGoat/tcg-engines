import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { fireThatBurnsWithinRed } from "./fire-that-burns-within.ts";

describe("Fire that Burns Within (PEN255) AAA", () => {
  it("happy: discard a Phoenix Flame to draw and get +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [fireThatBurnsWithinRed, phoenixFlameRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(fireThatBurnsWithinRed);
    game.advanceToDecision(Fai, "boolean");
    Fai.accept();
    if (game.pendingDecision()?.kind === "entity-target") Fai.target(phoenixFlameRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Fai).toHaveHandCount(1);
  });

  it("boundary: declining the discard leaves this at printed 2", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [fireThatBurnsWithinRed, phoenixFlameRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(fireThatBurnsWithinRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveLife(18);
    expectFabPlayer(Fai).toHaveHandCount(1);
  });

  it("timing: go again refunds at chain-link resolution, not on declaration", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [fireThatBurnsWithinRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(fireThatBurnsWithinRed);
    expectFabPlayer(Fai).toHaveAP(0);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Fai).toHaveAP(1);
  });
});
