import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { crouchingTiger } from "./crouching-tiger.ts";

describe("Crouching Tiger (DYN065) AAA", () => {
  it("happy: go again refunds AP and Ephemeral keeps this out of the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [crouchingTiger], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(crouchingTiger);
    expectCombat(game)
      .toBeAtStep("defend")
      .toHaveKeyword("go-again")
      .toHaveKeyword("ephemeral")
      .toHaveAttackPower(0);
    game.as(dash).defendWith();
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabPlayer(Katsu).toHaveAP(1);
    expect(Katsu.zone("graveyard")).not.toContain(crouchingTiger.canonicalId);
    expect(Katsu.zone("hand")).not.toContain(crouchingTiger.canonicalId);
  });

  it("boundary: a non-ephemeral attack enters the graveyard after combat", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(brutalAssaultBlue);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Katsu, brutalAssaultBlue).toBeIn("graveyard");
    expectFabPlayer(Katsu).toHaveAP(0);
  });

  it("timing: go again lets a second Crouching Tiger be played on the same turn", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [crouchingTiger, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(crouchingTiger);
    game.as(dash).defendWith();
    game.closeCombat();
    expectFabPlayer(Katsu).toHaveAP(1);
    expect(Katsu.zone("hand")).toHaveLength(1);

    Katsu.playAttack(crouchingTiger);
    expectCombat(game).toBeOpen().toHaveKeyword("ephemeral").toHaveAttackPower(0);
    game.as(dash).defendWith();
    game.closeCombat();

    expectFabPlayer(Katsu).toHaveAP(1);
    expect(Katsu.zone("hand")).toHaveLength(0);
    expect(Katsu.zone("graveyard")).not.toContain(crouchingTiger.canonicalId);
  });
});
