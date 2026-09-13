import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { toThePointRed } from "./to-the-point.ts";

/**
 * To the Point Red (HNT199) — Assassin Warrior Attack Reaction.
 *
 * Printed: Target dagger attack gets +3{p}. If the defending hero is
 * marked, instead it gets +4{p}.
 */

describe("To the Point (HNT199) AAA", () => {
  it("happy: an unmarked defender's dagger swing gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [nerveScalpel],
        hand: [toThePointRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.activateAttack(nerveScalpel);
    game.toReaction("attacker");
    const scalpelId = Fang.findCardInZone("weapon1", nerveScalpel);
    Fang.play(toThePointRed, { target: scalpelId });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Dash).toHaveLife(16); // 20 - (1 + 3)
    expectFabCard(Fang, toThePointRed).toBeIn("graveyard");
  });
});
