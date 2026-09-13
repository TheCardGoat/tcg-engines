import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";

import { spinningWheelKickRed } from "./spinning-wheel-kick.ts";

describe("Spinning Wheel Kick (OUT062) AAA", () => {
  it("happy: after Twin Twisters this is 5{p} and returns to deck bottom on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spinningWheelKickRed, spinningWheelKickRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(spinningWheelKickRed);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(spinningWheelKickRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabCard(Bravo, spinningWheelKickRed).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(11);
  });

  it("boundary: without Twin Twisters this stays 4{p} and goes to graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spinningWheelKickRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(spinningWheelKickRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabCard(Bravo, spinningWheelKickRed).toBeIn("graveyard");
  });

  it("timing: chaining another Spinning Wheel Kick also puts it on the bottom", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spinningWheelKickRed, spinningWheelKickRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(spinningWheelKickRed);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(spinningWheelKickRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
    expectFabCard(Bravo, spinningWheelKickRed).toBeIn("graveyard");
  });
});
