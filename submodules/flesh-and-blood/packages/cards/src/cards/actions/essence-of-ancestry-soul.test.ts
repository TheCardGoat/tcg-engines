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
import { snatchRed } from "./snatch.ts";
import { woundingBlowYellow } from "./wounding-blow.ts";
import { essenceOfAncestrySoulYellow } from "./essence-of-ancestry-soul.ts";

/**
 * Essence of Ancestry: Soul (MST138) — Illusionist Action Aura, cost 0, 3{d}.
 *
 * Printed: "When this leaves the arena, if you control no Illusionist auras,
 * the next time you would be dealt damage by a yellow source this turn,
 * prevent it.\nWard 2"
 */

describe("Essence of Ancestry: Soul (MST138) AAA", () => {
  it("happy: after this leaves as the last Illusionist aura, the next yellow-source damage this turn is prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundingBlowYellow, woundingBlowYellow],
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestrySoulYellow],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(woundingBlowYellow);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Enigma, essenceOfAncestrySoulYellow).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(19);

    Dash.playAttack(woundingBlowYellow);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(19);
  });

  it("boundary: if another Illusionist aura remains, leave-arena does not arm yellow prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundingBlowYellow, woundingBlowYellow],
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestrySoulYellow, passingMirageBlue],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(woundingBlowYellow);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Enigma, essenceOfAncestrySoulYellow).toBeIn("graveyard");
    expectFabCard(Enigma, passingMirageBlue).toBeIn("arena");
    expectFabPlayer(Enigma).toHaveLife(19);

    Dash.playAttack(woundingBlowYellow);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(16);
  });

  it("boundary: a red source is not prevented after this leaves", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundingBlowYellow, snatchRed],
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestrySoulYellow],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(woundingBlowYellow);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Enigma, essenceOfAncestrySoulYellow).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(19);

    Dash.playAttack(snatchRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(15);
  });

  it("timing: the yellow-source prevention expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundingBlowYellow, woundingBlowYellow],
        actionPoints: 1,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestrySoulYellow],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(woundingBlowYellow);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Enigma, essenceOfAncestrySoulYellow).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(19);
    Dash.endTurn();
    Enigma.endTurn();

    Dash.playAttack(woundingBlowYellow);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(16);
  });
});
