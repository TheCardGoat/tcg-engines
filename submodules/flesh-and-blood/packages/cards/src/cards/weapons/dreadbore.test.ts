import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { searingShotRed } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { unmovableRed } from "../defense-reactions/unmovable.ts";
import { dreadbore } from "./dreadbore.ts";

/**
 * Dreadbore (EVR087) — Ranger Weapon Bow (2H).
 *
 * Printed: 'Once per Turn Action - {r}: You may put an arrow card from your
 * hand face up into an empty arsenal zone you control. If you do, it gains
 * +1{p} until end of turn. Go again
 * Arrows you control have "Defense reactions can't be played from hand this
 * chain link."'
 */

describe("Dreadbore (EVR087) AAA", () => {
  it("happy: Action puts an arrow face up into empty arsenal, has go again, and attacks at +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [dreadbore],
        hand: [searingShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(dreadbore, {
      abilityId:
        "7WhjMkMzcRQ9M7cpzFcpH:oncePerTurnActionResourcePutArrowHandFaceUpEmptyArsenalZoneGains1PowerEndTurnGoAgain",
    });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal").toBeFaceUp();
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("happy: the loaded arrow attacks at 5{p} from the +1{p} if-you-do", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [dreadbore],
        hand: [searingShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(dreadbore, {
      abilityId:
        "7WhjMkMzcRQ9M7cpzFcpH:oncePerTurnActionResourcePutArrowHandFaceUpEmptyArsenalZoneGains1PowerEndTurnGoAgain",
    });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });
    Azalea.playAttack(searingShotRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: occupied arsenal does not load an arrow from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [dreadbore],
        hand: [searingShotRed],
        arsenal: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(dreadbore, {
      abilityId:
        "7WhjMkMzcRQ9M7cpzFcpH:oncePerTurnActionResourcePutArrowHandFaceUpEmptyArsenalZoneGains1PowerEndTurnGoAgain",
    });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Azalea, searingShotRed).toBeIn("hand");
    expectFabCard(Azalea, snatchRed).toBeIn("arsenal");
  });

  it("timing: arrows you control forbid defense reactions from hand this chain link", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [dreadbore],
        arsenal: [{ card: searingShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [unmovableRed], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    game.toReaction("defender");

    expect(() => Dash.play(unmovableRed)).toThrow(
      /Defense reaction cards cannot be played for this chain link/,
    );
    expectFabCard(Dash, unmovableRed).toBeIn("hand");
  });
});
