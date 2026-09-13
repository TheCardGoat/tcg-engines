import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { gateToIArathael } from "../tokens/gate-to-i-arathael.ts";
import { vexingGloombladeRed } from "./vexing-gloomblade.ts";

/**
 * Vexing Gloomblade, Red (IAR117) — Shadow Runeblade Action - Attack, 5{p},
 * Usurp, Blood Debt.
 *
 * Printed: "You may play this from your banished zone.\nUsurp\nWhen this hits a
 * hero, deal 2 arcane damage to any target.\nBlood Debt"
 */

describe("Vexing Gloomblade (IAR117) AAA", () => {
  it("happy: a hitting gloomblade adds 2 arcane damage to its physical hit", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [vexingGloombladeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(vexingGloombladeRed);
    Dash.defendWith();
    game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
    Viserai.targetRequired(Dash);
    game.closeCombat();

    // 5 physical + 2 arcane on the unblocked hero.
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: Usurp does not make opposing auras attackable", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [vexingGloombladeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [gateToIArathael], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    const auraId = Dash.findCardInZone("arena", gateToIArathael);

    expect(() => Viserai.must.playAttack(vexingGloombladeRed, { target: auraId })).toThrow();

    expect(Dash.zone("arena")).toContain(gateToIArathael.canonicalId);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: the gloomblade may be played straight from the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        banished: [vexingGloombladeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(vexingGloombladeRed, { from: "banished" });
    Dash.defendWith();
    game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
    Viserai.targetRequired(Dash);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13);
  });
});
