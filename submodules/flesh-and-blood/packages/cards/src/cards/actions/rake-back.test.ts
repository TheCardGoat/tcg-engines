import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { gold } from "../tokens/gold.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { hala } from "../heroes/hala.ts";
import { durendal } from "../weapons/durendal.ts";
import { rakeBackBlue } from "./rake-back.ts";

/**
 * Rake Back (MPW033) — Warrior Action, cost 2, 3{d}.
 *
 * Printed: 'You may destroy a Gold you control rather than pay this card's
 * {r} cost. Your next sword attack this turn gets +2{p} and "When this
 * attacks, wager with the defending hero. The winner may equip an
 * equipment card from their graveyard." Go again'
 */

describe("Rake Back (MPW033) AAA", () => {
  it("happy: destroying a Gold pays the alternative cost and the next sword attack gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [durendal],
        hand: [rakeBackBlue],
        arena: [gold],
        graveyard: [ironrotPlate],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    Hala.play(rakeBackBlue, { modeIds: ["pay"] });
    game.untilIdle({ entityTargets: "minimum" });

    expect(Hala.zone("arena")).not.toContain("token:gold");
    expectFabCard(Hala, rakeBackBlue).toBeIn("graveyard");
    expectFabPlayer(Hala).toHaveAP(1);
    expectFabPlayer(Hala).toHaveResourceCount(1);

    Hala.activateAttack(durendal, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(5);
    game.advanceUntil({ stopAt: "idle", optionals: "accept", entityTargets: "minimum" });
    expectFabCard(Hala, ironrotPlate).toBeIn("chest");
  });

  it("boundary: a non-sword attack neither gains +2{p} nor opens the granted wager", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [durendal],
        hand: [rakeBackBlue, brutalAssaultBlue],
        arena: [gold],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    Hala.play(rakeBackBlue, { modeIds: ["decline"] });
    game.untilIdle({ entityTargets: "minimum" });
    expectFabCard(Hala, gold).toBeIn("arena");
    expectFabPlayer(Hala).toHaveResourceCount(3);

    Hala.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });

    Hala.activateAttack(durendal);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        hand: [rakeBackBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    expectFabPlayer(Hala).toHaveAP(1);
    Hala.play(rakeBackBlue);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Hala).toHaveAP(1);
    expectFabCard(Hala, rakeBackBlue).toBeIn("graveyard");
  });
});
