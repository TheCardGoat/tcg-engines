import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kayoStrongArm } from "../heroes/kayo-strong-arm.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { arrogantShowboatingBlue } from "./arrogant-showboating.ts";

/**
 * Arrogant Showboating (SUP096) — Reviled Instant, cost 0.
 * Printed: Create a Might token for each defending card controlled by an
 * opponent on the combat chain.
 */

describe("Arrogant Showboating (SUP096) AAA", () => {
  it("happy: one defending card creates 1 Might", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [brutalAssaultBlue, arrogantShowboatingBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);
    const Dash = game.as(dash);

    Kayo.playAttack(brutalAssaultBlue);
    Dash.defendWith(brutalAssaultBlue);
    game.toReaction("attacker");
    Kayo.play(arrogantShowboatingBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kayo).toHaveTokenCount("might", 1);
    expectFabCard(Kayo, arrogantShowboatingBlue).toBeIn("graveyard");
  });

  it("boundary: with no defending cards, no Might is created", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [brutalAssaultBlue, arrogantShowboatingBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Kayo.play(arrogantShowboatingBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kayo).toHaveTokenCount("might", 0);
  });

  it("timing: may be cast in the reaction window and spends no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [brutalAssaultBlue, arrogantShowboatingBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.playAttack(brutalAssaultBlue);
    game.as(dash).defendWith(brutalAssaultBlue);
    game.toReaction("attacker");
    Kayo.play(arrogantShowboatingBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kayo).toHaveAP(0);
  });
});
