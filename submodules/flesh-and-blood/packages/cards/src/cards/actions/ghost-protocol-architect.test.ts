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
import { ghostProtocolArchitectRed } from "./ghost-protocol-architect.ts";

describe("Ghost Protocol: Architect (PEN062) AAA", () => {
  it("happy: after boosting this turn you may play this from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed],
        banished: [ghostProtocolArchitectRed],
        deck: [grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: bravo, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Dash.attackWith(ghostProtocolArchitectRed, { from: "banished" });

    expect(game.combat()?.activeLink?.attackPower).toBe(1);
  });

  it("boundary: without boosting this turn this cannot be played from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        banished: [ghostProtocolArchitectRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.attackWith(ghostProtocolArchitectRed, { from: "banished" })).toThrow();
    expectFabCard(Dash, ghostProtocolArchitectRed).toBeBanished();
  });
});
