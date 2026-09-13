import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { passingMirageBlue } from "./passing-mirage.ts";
import { woundingBlowRed } from "./wounding-blow.ts";
import { snatchBlue } from "./snatch.ts";
import { essenceOfAncestryBodyRed } from "./essence-of-ancestry-body.ts";

/**
 * Essence of Ancestry: Body (MST137) — Illusionist Action Aura, cost 0, 3{d}.
 *
 * Printed: "When this leaves the arena, if you control no Illusionist auras,
 * the next time you would be dealt damage by a red source this turn, prevent
 * it.\nWard 2"
 */

describe("Essence of Ancestry: Body (MST137) AAA", () => {
  it("happy: after this leaves as the last Illusionist aura, the next red-source damage this turn is prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundingBlowRed, woundingBlowRed],
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestryBodyRed],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(woundingBlowRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Enigma, essenceOfAncestryBodyRed).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(18);

    Dash.playAttack(woundingBlowRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(18);
  });

  it("boundary: if another Illusionist aura remains, leave-arena does not arm red prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundingBlowRed, woundingBlowRed],
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestryBodyRed, passingMirageBlue],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(woundingBlowRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Enigma, essenceOfAncestryBodyRed).toBeIn("graveyard");
    expectFabCard(Enigma, passingMirageBlue).toBeIn("arena");
    expectFabPlayer(Enigma).toHaveLife(18);

    Dash.playAttack(woundingBlowRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(14);
  });

  it("boundary: a blue source is not prevented after this leaves", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundingBlowRed, snatchBlue],
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestryBodyRed],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(woundingBlowRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Enigma, essenceOfAncestryBodyRed).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(18);

    Dash.playAttack(snatchBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(16);
  });

  it("timing: the red-source prevention expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundingBlowRed, woundingBlowRed],
        actionPoints: 1,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestryBodyRed],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(woundingBlowRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Enigma, essenceOfAncestryBodyRed).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(18);
    Dash.endTurn();
    Enigma.endTurn();

    Dash.playAttack(woundingBlowRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(14);
  });
});
