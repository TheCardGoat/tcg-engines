import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { soulbeadStrikeRed } from "./soulbead-strike.ts";
import { craneDanceRed } from "./crane-dance.ts";
import { heronSFlightRed } from "./heron-s-flight.ts";

const restrictDefenseModeId = `${heronSFlightRed.canonicalId}:comboCraneDanceLastAttackCombatChainAttackHeronsFlightGains2PowerChoose1HeronsFlightCanOnlyDefendedAttackActionHeronsFlightCanOnlyDefendedNonAttackAction:heronsFlightCanOnlyDefendedAttackAction`;

describe("Heron's Flight (CRU056) AAA", () => {
  it("happy: after Crane Dance, this gains +2{p} and may restrict defense to attack actions", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soulbeadStrikeRed, craneDanceRed, heronSFlightRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(soulbeadStrikeRed);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(craneDanceRed);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(heronSFlightRed, { stopAt: "on-attack" });
    Bravo.choose(restrictDefenseModeId);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(5);
    Dash.defendWith();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(7);
  });

  it("boundary: without Crane Dance as the last attack this has printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [heronSFlightRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(heronSFlightRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("boundary: without combo, a non-attack action may still defend", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [heronSFlightRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(heronSFlightRed);
    Dash.defendWith(brutalAssaultBlue);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
