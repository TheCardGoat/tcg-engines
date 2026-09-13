import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { backForSecondsYellow } from "./back-for-seconds.ts";

/**
 * Back for Seconds (DDD011) — Warrior Attack Reaction, cost 1, 2{d}.
 *
 * Printed: "Target sword attack gets +2{p}. If it's your second attack this
 * turn, instead it gets +3{p}."
 *
 * The instead-branch keys off unhandled `your-second-attack-this-turn`.
 * Playing the reaction onto a sword attack throws at resolution. Non-sword
 * attacks are a silent no-op. Pin both; do not half-fix.
 */

describe("Back for Seconds (DDD011) AAA", () => {
  it("boundary: a non-sword attack is not a legal target (silent no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [brutalAssaultBlue, backForSecondsYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Dori.must.playReaction(backForSecondsYellow));

    expectFabCard(Dori, backForSecondsYellow).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });
});
