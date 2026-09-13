import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { leviaShadowbornAbomination } from "../heroes/levia-shadowborn-abomination.ts";
import { markOfTheBeastYellow } from "./mark-of-the-beast.ts";

/**
 * Mark of the Beast Yellow (MON124) — Shadow Brute Attack Action. Blood Debt.
 *
 * Printed: If Mark of the Beast would be put into your graveyard from
 * anywhere, instead banish it.
 */

describe("Mark of the Beast (MON124) AAA", () => {
  it("happy: resolving the attack banishes it instead of the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [markOfTheBeastYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);
    const Dash = game.as(dash);

    Levia.playAttack(markOfTheBeastYellow);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(14); // 20 - 6
    expectFabCard(Levia, markOfTheBeastYellow).toBeBanished();
  });

  it("timing: Blood Debt drains 1 life at the end phase while banished", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        banished: [markOfTheBeastYellow],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Levia).toHaveLife(39); // 40 base - 1
  });
});
