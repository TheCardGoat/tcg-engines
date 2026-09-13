import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { passingMirageBlue } from "./passing-mirage.ts";
import { snatchBlue } from "./snatch.ts";
import { snatchRed } from "./snatch.ts";
import { enigma } from "../heroes/enigma.ts";
import { essenceOfAncestryMindBlue } from "./essence-of-ancestry-mind.ts";

/**
 * Essence of Ancestry: Mind (ENG017) — Illusionist Action Aura, cost 0, 3{d}.
 *
 * Printed: "When this leaves the arena, if you control no Illusionist auras,
 * the next time you would be dealt damage by a blue source this turn, prevent
 * it.\nWard 2"
 */

describe("Essence of Ancestry: Mind (ENG017) AAA", () => {
  it("happy: after this leaves as the last Illusionist aura, the next blue-source damage this turn is prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchBlue, snatchBlue],
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestryMindBlue],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(snatchBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Enigma, essenceOfAncestryMindBlue).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(20);

    Dash.playAttack(snatchBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(20);
  });

  it("boundary: if another Illusionist aura remains, leave-arena does not arm blue prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchBlue, snatchBlue],
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestryMindBlue, passingMirageBlue],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(snatchBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Enigma, essenceOfAncestryMindBlue).toBeIn("graveyard");
    expectFabCard(Enigma, passingMirageBlue).toBeIn("arena");
    expectFabPlayer(Enigma).toHaveLife(20);

    Dash.playAttack(snatchBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(18);
  });

  it("boundary: a red source is not prevented after this leaves", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchBlue, snatchRed],
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestryMindBlue],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(snatchBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Enigma, essenceOfAncestryMindBlue).toBeIn("graveyard");

    Dash.playAttack(snatchRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(16);
  });

  it("timing: the blue-source prevention expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchBlue, snatchBlue],
        actionPoints: 1,
        deck: 8,
      },
      {
        hero: enigma,
        hand: [],
        arena: [essenceOfAncestryMindBlue],
        life: 20,
        deck: 8,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Enigma = game.as(enigma);

    Dash.playAttack(snatchBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Enigma, essenceOfAncestryMindBlue).toBeIn("graveyard");
    Dash.endTurn();
    Enigma.endTurn();

    Dash.playAttack(snatchBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Enigma).toHaveLife(18);
  });
});
