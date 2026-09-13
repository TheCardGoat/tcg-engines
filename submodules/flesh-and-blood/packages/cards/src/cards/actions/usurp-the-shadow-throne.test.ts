import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { runechant } from "../tokens/runechant.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { usurpTheShadowThroneBlue } from "./usurp-the-shadow-throne.ts";
import { vexingGloombladeBlue } from "./vexing-gloomblade.ts";

describe("Usurp the Shadow Throne (IAR110) AAA", () => {
  it("happy: usurping enables the discounted banished play and drains for newly hidden cards", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [vexingGloombladeBlue],
        arena: [runechant],
        banished: [usurpTheShadowThroneBlue],
        resourcePoints: 10,
        actionPoints: 2,
        life: 10,
        deck: 6,
      },
      {
        hero: dash,
        banished: [
          { card: snatchRed, state: { faceDown: false } },
          { card: nimblismBlue, state: { faceDown: false } },
        ],
        hand: [],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.must.playAttack(vexingGloombladeBlue);
    game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
    Viserai.targetRequired(Dash);
    game.closeCombat();
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
    expectFabPlayer(Viserai).toHaveResourceCount(7);

    Viserai.playAttack(usurpTheShadowThroneBlue, { from: "banished" });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Viserai).toHaveResourceCount(0).toHaveLife(12);
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, snatchRed).toBeFaceDown();
    expectFabCard(Dash, nimblismBlue).toBeFaceDown();
  });

  it("boundary: without a prior usurp the banished card is not playable", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        banished: [usurpTheShadowThroneBlue],
        resourcePoints: 13,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    expect(() => Viserai.playAttack(usurpTheShadowThroneBlue, { from: "banished" })).toThrow();
    expectFabCard(Viserai, usurpTheShadowThroneBlue).toBeBanished();
  });

  it("UST notes: usurped-this-turn is a one-time −6, including from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [vexingGloombladeBlue, usurpTheShadowThroneBlue],
        arena: [runechant],
        resourcePoints: 10,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.must.playAttack(vexingGloombladeBlue);
    game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
    Viserai.targetRequired(game.as(dash));
    game.closeCombat();
    expectFabPlayer(Viserai).toHaveResourceCount(7);

    Viserai.playAttack(usurpTheShadowThroneBlue);
    game.closeCombat();

    expectFabPlayer(Viserai).toHaveResourceCount(0);
    expectFabCard(Viserai, usurpTheShadowThroneBlue).toBeIn("graveyard");
  });
});
