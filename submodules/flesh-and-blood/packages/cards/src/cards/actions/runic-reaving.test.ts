import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { runechant } from "../tokens/runechant.ts";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { runicReaving } from "./runic-reaving.ts";

describe("Runic Reaving preview behavior", () => {
  it("Usurp requires one controlled Runechant and increases the attack by two", () => {
    const card = runicReaving.cards.red;
    const game = FabTestEngine.start(
      { hero: viserai, hand: [card], arena: [runechant], deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(viserai);
    player.play(card);
    player.target(runechant);
    game.advanceUntil({ stopAt: "defend" });
    expectFabPlayer(player).toHaveTokenCount("runechant", 0);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
  it("without a Runechant, Usurp plays at printed power", () => {
    const card = runicReaving.cards.red;
    const game = FabTestEngine.start(
      { hero: viserai, hand: [card], deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(viserai).playAttack(card);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
  for (const [color, card] of Object.entries(runicReaving.cards)) {
    it(`${color}: discarding from hand creates one Runechant without spending an action point`, () => {
      const game = FabTestEngine.start(
        { hero: viserai, hand: [card], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(viserai);
      player.activate(card);
      game.untilIdle();
      expectFabCard(player, card).toBeIn("graveyard");
      expectFabPlayer(player).toHaveTokenCount("runechant", 1).toHaveAP(1);
      expectFabPlayer(game.as(dash)).toHaveTokenCount("runechant", 0);
    });
    it(`${color}: the discarded card cannot be activated again`, () => {
      const game = FabTestEngine.start(
        { hero: viserai, hand: [card], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(viserai);
      player.activate(card);
      game.untilIdle();
      player.expectActivationRejected(card);
      expectFabPlayer(player).toHaveTokenCount("runechant", 1);
    });
    it(`${color}: the instant ability is unavailable in banishment`, () => {
      const game = FabTestEngine.start(
        { hero: viserai, hand: [], banished: [card], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(viserai);
      player.expectActivationRejected(card);
      expectFabCard(player, card).toBeBanished();
      expectFabPlayer(player).toHaveTokenCount("runechant", 0);
    });
  }
});
