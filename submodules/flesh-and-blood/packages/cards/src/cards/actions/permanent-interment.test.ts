import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { satiateBloodthirstRed } from "./satiate-bloodthirst.ts";
import { satiateBloodthirstYellow } from "./satiate-bloodthirst.ts";
import { nimblismBlue } from "./nimblism.ts";
import { permanentIntermentRed } from "./permanent-interment.ts";

/**
 * Permanent Interment — Shadow Action - Attack, cost 0.
 *
 * Printed: When this attacks, you may pay up to {r}{r}{r}. Turn that many
 * Shadow cards in your banished zone face-down. This gets +1{p} for each
 * card turned face-down this way. Blood Debt
 */

describe("Permanent Interment AAA", () => {
  it("happy: paying 2{r} turns two Shadow cards face-down and this gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [permanentIntermentRed],
        banished: [
          { card: satiateBloodthirstRed, state: { faceDown: false } },
          { card: satiateBloodthirstYellow, state: { faceDown: false } },
        ],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(permanentIntermentRed, { stopAt: "on-attack" });
    Chane.accept();
    Chane.chooseNumeric(2);
    Chane.target(
      Chane.cardIn("banished", satiateBloodthirstRed),
      Chane.cardIn("banished", satiateBloodthirstYellow),
    );

    expectFabCard(Chane, satiateBloodthirstRed).toBeFaceDown();
    expectFabCard(Chane, satiateBloodthirstYellow).toBeFaceDown();
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: declining the pay leaves printed power and face-up banished cards", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [permanentIntermentRed],
        banished: [{ card: satiateBloodthirstRed, state: { faceDown: false } }],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(permanentIntermentRed, { stopAt: "on-attack" });
    Chane.decline();
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabCard(Chane, satiateBloodthirstRed).toBeBanished();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: a non-Shadow banished card cannot be turned for the power bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [permanentIntermentRed],
        banished: [{ card: nimblismBlue, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(permanentIntermentRed, { stopAt: "on-attack" });
    Chane.accept();
    Chane.chooseNumeric(1);
    Chane.target();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Chane, nimblismBlue).toBeBanished();
  });
});
