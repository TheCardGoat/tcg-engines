import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { meganeticLockwaveBlue } from "./meganetic-lockwave.ts";

/**
 * Meganetic Lockwave (EVO143) — Mechanologist Action, go again.
 *
 * Printed: Target hero chooses X equipment they control, then you choose 1
 * from among them. That hero must defend your attacks this turn with that
 * equipment if able. Go again.
 *
 * Seat Teklovossen (not Dash). The choose-card step looks in `permanent` for
 * Equipment (equipment lives in slot zones), so resolution fail-closes with
 * an unresolved choose-card target.
 */

const playLockwave = (game: ReturnType<typeof FabTestEngine.start>, xValue: number) => {
  const Teklo = game.as(teklovossen);
  Teklo.play(meganeticLockwaveBlue, { xValue, target: game.as(bravo).id });
  game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
};

describe("Meganetic Lockwave (EVO143) AAA", () => {
  it("happy (module gap): choosing the defender's equipment throws unresolved choose-card", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [meganeticLockwaveBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, head: [tekloBaseHead], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expect(() => playLockwave(game, 1)).toThrow(/choose-card target is unresolved/);
    expectFabCard(game.as(bravo), tekloBaseHead).toBeIn("head");
  });

  it("boundary (module gap): X=0 still wedges on the unresolved choose-card target", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [meganeticLockwaveBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, head: [tekloBaseHead], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => playLockwave(game, 0)).toThrow(/choose-card target is unresolved/);
    expectFabCard(game.as(bravo), tekloBaseHead).toBeIn("head");
  });

  it("timing (module gap): with no equipment seated the choose-card target is still unresolved", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [meganeticLockwaveBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expect(() => playLockwave(game, 1)).toThrow(/choose-card target is unresolved/);
    expect(Teklo.zone("graveyard")).not.toContain(meganeticLockwaveBlue.canonicalId);
  });
});
