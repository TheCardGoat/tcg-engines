import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabPlayer,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { brutalAssaultBlue, brutalAssaultRed } from "../actions/brutal-assault.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { echoingTrapBlue } from "./echoing-trap.ts";
import { maskOfManyFaces } from "../equipment/mask-of-many-faces.ts";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
describe("Echoing Trap preview behavior", () => {
  for (const repeated of [false, true]) {
    it(`a two-name attack ${repeated ? "discards after an earlier matching play" : "does not count as another card by itself"}`, () => {
      const game = FabTestEngine.start(
        {
          hero: iraCrimsonHaze,
          head: [maskOfManyFaces],
          hand: [brutalAssaultBlue, nimblismBlue, ...(repeated ? [brutalAssaultRed] : [])],
          resourcePoints: 5,
          actionPoints: 2,
          deck: [],
        },
        { hero: azalea, hand: [echoingTrapBlue], life: 30, deck: [] },
        FAB_MANUAL_HARNESS,
      );
      const attacker = game.as(iraCrimsonHaze);
      if (repeated) {
        attacker.playAttack(brutalAssaultRed);
        game.closeCombat();
      }
      attacker.activate(maskOfManyFaces);
      game.untilIdle({ entityTargets: "pause" });
      attacker.choose("Crouching Tiger");
      game.untilIdle();
      attacker.playAttack(brutalAssaultBlue);
      expectFabCard(attacker, brutalAssaultBlue)
        .toHaveName("Brutal Assault")
        .toHaveName("Crouching Tiger");
      game.as(azalea).defendWith(echoingTrapBlue);
      game.untilIdle({ entityTargets: "maximum" });
      expectFabPlayer(attacker).toHaveHandCount(repeated ? 0 : 1);
    });
  }
  for (const repeated of [true, false]) {
    it(`${repeated ? "discards" : "retains"} a card when the defended attack ${repeated ? "repeats" : "does not repeat"} a played name`, () => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          hand: [repeated ? brutalAssaultRed : nimblismBlue, brutalAssaultBlue, nimblismBlue],
          resourcePoints: 4,
          actionPoints: 2,
          deck: 6,
        },
        { hero: azalea, hand: [echoingTrapBlue], life: 30, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const attacker = game.as(dash);
      if (repeated) {
        attacker.playAttack(brutalAssaultRed);
        game.closeCombat();
      } else {
        attacker.play(nimblismBlue);
        game.untilIdle();
      }
      attacker.playAttack(brutalAssaultBlue);
      game.as(azalea).defendWith(echoingTrapBlue);
      game.untilIdle({ entityTargets: "maximum" });
      expectFabPlayer(attacker).toHaveHandCount(repeated ? 0 : 1);
    });
  }
});
