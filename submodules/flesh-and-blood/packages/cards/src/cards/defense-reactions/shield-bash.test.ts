import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { fortitudeOfAnvilheim } from "../equipment/fortitude-of-anvilheim.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { shieldBashRed } from "./shield-bash.ts";

describe("Shield Bash family AAA", () => {
  it("deals its unless damage when a Guardian off-hand defends", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [brutalAssaultBlue], resourcePoints: 4, actionPoints: 1, deck: 6 },
      {
        hero: oldhim,
        hand: [shieldBashRed],
        weapon2: [fortitudeOfAnvilheim],
        resourcePoints: 3,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Oldhim = game.as(oldhim);
    Kano.playAttack(brutalAssaultBlue);
    game.advanceUntil({ stopAt: "defend" });
    Oldhim.defendWith(fortitudeOfAnvilheim);
    game.advanceCombatTo("reaction");
    Kano.pass();
    Oldhim.play(shieldBashRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Kano).toHaveLife(14);
  });
});
