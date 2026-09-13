import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { clashOfMightYellow } from "../actions/clash-of-might.ts";
import { stonewallImpasse } from "../equipment/stonewall-impasse.ts";
import { disableYellow } from "../actions/disable.ts";
import { risingKneeThrustBlue } from "../actions/rising-knee-thrust.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { victorGoldmaneMatchFixer } from "./victor-goldmane-match-fixer.ts";

describe("Victor Goldmane, Match Fixer (SMP006) AAA", () => {
  it("happy: destroying 3 Gold on attack grants +3{p} and dominate", () => {
    const gold = fabToken("gold");
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneMatchFixer,
        hand: [snatchRed],
        arena: [gold, gold, gold],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmaneMatchFixer);

    Victor.playAttack(snatchRed, { stopAt: "on-attack" });
    Victor.accept();
    expectCombat(game).toHaveAttackPower(7);
    expectCombat(game).toHaveKeyword("dominate");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Victor).toHaveTokenCount("gold", 0);
  });

  it("boundary: declining the Gold destroy leaves printed attack power", () => {
    const gold = fabToken("gold");
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneMatchFixer,
        hand: [snatchRed],
        arena: [gold, gold, gold],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmaneMatchFixer);

    Victor.playAttack(snatchRed, { stopAt: "on-attack" });
    Victor.decline();
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("dominate");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Victor).toHaveTokenCount("gold", 3);
  });

  it("timing: with no Gold, the optional does not open", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneMatchFixer,
        hand: [snatchRed],
        arena: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmaneMatchFixer);

    Victor.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("happy: the chosen opponent winning their next clash creates exactly one Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneMatchFixer,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
        intellect: 0,
      },
      {
        hero: dash,
        arms: [stonewallImpasse],
        deck: [disableYellow],
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmaneMatchFixer);
    const Dash = game.as(dash);

    Victor.activate(victorGoldmaneMatchFixer);
    game.helpers.resolveUntilIdle();
    Victor.attackWith(snatchRed);
    Dash.defendWith(stonewallImpasse);
    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Victor).toHaveTokenCount("gold", 1);
    expect(
      game
        .getView({ role: "player", actorId: Victor.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
  });

  it("boundary: the chosen opponent losing their next clash expires the Gold trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneMatchFixer,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [snatchRed],
        intellect: 0,
      },
      {
        hero: dash,
        arms: [stonewallImpasse],
        deck: [nimblismBlue],
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmaneMatchFixer);
    const Dash = game.as(dash);

    Victor.activate(victorGoldmaneMatchFixer);
    game.helpers.resolveUntilIdle();
    Victor.attackWith(snatchRed);
    Dash.defendWith(stonewallImpasse);
    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Victor).toHaveTokenCount("gold", 0);
    expect(
      game
        .getView({ role: "player", actorId: Victor.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
  });

  it("timing: the next-clash trigger expires at end of turn when no clash occurs", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneMatchFixer,
        intellect: 0,
        deck: 6,
      },
      { hero: dash, intellect: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmaneMatchFixer);

    Victor.activate(victorGoldmaneMatchFixer);
    game.helpers.resolveUntilIdle();
    expect(
      game
        .getView({ role: "player", actorId: Victor.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(true);

    Victor.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expect(
      game
        .getView({ role: "player", actorId: Victor.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
  });

  it("boundary: a tied next clash still consumes the one-clash window", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneMatchFixer,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: [nimblismBlue, risingKneeThrustBlue],
        intellect: 0,
      },
      {
        hero: dash,
        arms: [stonewallImpasse],
        hand: [clashOfMightYellow],
        deck: [disableYellow, nimblismBlue],
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmaneMatchFixer);
    const Dash = game.as(dash);

    Victor.activate(victorGoldmaneMatchFixer);
    game.helpers.resolveUntilIdle();
    Victor.attackWith(snatchRed);
    Dash.defendWith(stonewallImpasse);
    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Victor).toHaveTokenCount("gold", 0);
    expect(
      game
        .getView({ role: "player", actorId: Victor.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
    game.closeCombat({ ordering: "listed" });

    // The first clash tied (1 vs the chosen opponent's boosted 0). A later
    // clash that Dash wins must not satisfy the already-consumed window.
    Victor.attackWith(snatchRed);
    Dash.defendWith(clashOfMightYellow);
    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Victor).toHaveTokenCount("gold", 0);
    expect(
      game
        .getView({ role: "player", actorId: Victor.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
  });
});
