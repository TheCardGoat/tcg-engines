import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { evoBetaBaseHeadBlue } from "./evo-beta-base-head.ts";
import { ghostProtocolMainframeBlue } from "./ghost-protocol-mainframe.ts";

describe("Ghost Protocol: Mainframe (PEN063) AAA", () => {
  it("happy: after boosting this turn you may play this from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed],
        banished: [ghostProtocolMainframeBlue],
        deck: [grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: bravo, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Dash.attackWith(ghostProtocolMainframeBlue, { from: "banished" });

    expect(game.combat()?.activeLink?.attackPower).toBe(1);
  });

  it("happy: Evo Upgrade gives +1{p} for each equipped Evo", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoBetaBaseHeadBlue],
        hand: [ghostProtocolMainframeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(ghostProtocolMainframeBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });

  it("boundary: without boosting this turn this cannot be played from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        banished: [ghostProtocolMainframeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.attackWith(ghostProtocolMainframeBlue, { from: "banished" })).toThrow();
    expectFabCard(Dash, ghostProtocolMainframeBlue).toBeBanished();
  });
});
