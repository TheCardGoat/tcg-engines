import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { seepingShadowsYellow } from "./seeping-shadows.ts";
import { chane } from "../heroes/chane.ts";
import { tomeOfFyendalYellow } from "./tome-of-fyendal.ts";
import { unhallowedRitesRed } from "./unhallowed-rites.ts";

/**
 * Unhallowed Rites Red (CHN015) — Shadow Runeblade Attack Action. Blood Debt.
 *
 * Printed: If you have played a 'non-attack' action card this turn, you may
 * play Unhallowed Rites from your banished zone.
 * You may put a 'non-attack' action card with blood debt from your
 * graveyard on the bottom of your deck.
 */

describe("Unhallowed Rites (CHN015) AAA", () => {
  it("happy: after a non-attack action, plays from banished and bottoms a blood-debt card", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [tomeOfFyendalYellow],
        graveyard: [seepingShadowsYellow],
        banished: [unhallowedRitesRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(tomeOfFyendalYellow); // the 'non-attack' action that unlocks the banished play
    game.helpers.resolveUntilIdle();

    Chane.play(unhallowedRitesRed, { from: "banished" });
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: seepingShadowsYellow.canonicalId,
    });

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4 (attack through unblocked)
    expect(Chane.zone("deck")[0]).toBe(seepingShadowsYellow.canonicalId);
    expectFabCard(Chane, unhallowedRitesRed).toBeIn("graveyard");
  });

  it("boundary: without a non-attack action this turn the banished play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        banished: [unhallowedRitesRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    expect(() => Chane.play(unhallowedRitesRed, { from: "banished" })).toThrow(/reject/i);
    expectFabCard(Chane, unhallowedRitesRed).toBeBanished();
  });

  it("timing: Blood Debt drains 1 life at the end phase while this is banished", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        banished: [unhallowedRitesRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Chane).toHaveLife(19);
  });
});
