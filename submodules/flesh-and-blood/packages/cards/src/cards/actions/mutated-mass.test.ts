import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { disableRed } from "./disable.ts";
import { levia } from "../heroes/levia.ts";
import { rockyardRodeoBlue } from "./rockyard-rodeo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { mutatedMassBlue } from "./mutated-mass.ts";

describe("Mutated Mass (MON191) AAA", () => {
  it("happy: from banished, {p} is twice the number of distinct pitch costs", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        banished: [mutatedMassBlue],
        pitch: [nimblismBlue, rockyardRodeoBlue, disableRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(mutatedMassBlue, { from: "banished" });

    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: with an empty pitch zone it attacks at 0{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        banished: [mutatedMassBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(mutatedMassBlue, { from: "banished" });

    expectCombat(game).toHaveAttackPower(0);
  });

  it("timing: Blood Debt taxes 1 at end of turn while it remains public-banished", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        banished: [mutatedMassBlue],
        hand: [],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.untilIdle();

    expectFabPlayer(Levia).toHaveLife(19);
    expectFabCard(Levia, mutatedMassBlue).toBeBanished();
  });
});
