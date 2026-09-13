import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { aetherAshwing } from "../tokens/aether-ashwing.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { anaphylacticShockBlue } from "./anaphylactic-shock.ts";

/**
 * Anaphylactic Shock (HNT016) — Assassin Instant Trap.
 *
 * Printed: Each opposing hero and ally that has dealt damage to you this
 * turn loses 1{h}.
 *
 * Filter reads the controller's per-source damage-taken turn history
 * (`dealt-damage-to-you-this-turn`). Use a no-on-hit AAC so closeCombat
 * does not wedge on Snatch's draw.
 */

describe("Anaphylactic Shock (HNT016) AAA", () => {
  it("happy: the hero that dealt damage to you this turn loses 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: uzuri, hand: [anaphylacticShockBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Uzuri = game.as(uzuri);

    Dash.playAttack(brutalAssaultBlue);
    Uzuri.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Uzuri).toHaveLife(16);

    game.helpers.passPriorityTo(Uzuri);
    Uzuri.play(anaphylacticShockBlue);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Uzuri, anaphylacticShockBlue).toBeIn("graveyard");
  });

  it("boundary: a missed attack does not tax the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: uzuri,
        hand: [anaphylacticShockBlue, brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Uzuri = game.as(uzuri);
    const blockers = Uzuri.cardsIn("hand", brutalAssaultBlue);

    Dash.playAttack(brutalAssaultBlue);
    Uzuri.defendWith(blockers[0]!, blockers[1]!);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Uzuri).toHaveLife(20);

    game.helpers.passPriorityTo(Uzuri);
    Uzuri.play(anaphylacticShockBlue);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("happy: an opposing ally that dealt damage loses life without taxing its hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        weapon1: [stormOfSandikai],
        arena: [aetherAshwing],
        actionPoints: 1,
        deck: 6,
      },
      { hero: uzuri, hand: [anaphylacticShockBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dromai },
    );
    const Dromai = game.as(dromai);
    const Uzuri = game.as(uzuri);

    Dromai.activate(aetherAshwing);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Uzuri).toHaveLife(19);

    game.helpers.passPriorityTo(Uzuri);
    Uzuri.play(anaphylacticShockBlue);
    game.untilIdle();

    expect(Dromai.cardsIn("arena", aetherAshwing)).toHaveLength(0);
    expectFabPlayer(Dromai).toHaveLife(20);
  });

  it("timing: playing this before damage is dealt does not tax the attacker", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: uzuri, hand: [anaphylacticShockBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Uzuri = game.as(uzuri);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    Uzuri.play(anaphylacticShockBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Uzuri, anaphylacticShockBlue).toBeIn("graveyard");
  });
});
