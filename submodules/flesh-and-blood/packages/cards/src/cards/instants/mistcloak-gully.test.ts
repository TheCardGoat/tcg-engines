import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { mistcloakGully } from "./mistcloak-gully.ts";

describe("Mistcloak Gully (MST000) AAA", () => {
  it("happy: plays as a landmark from an Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [mistcloakGully],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(mistcloakGully);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Enigma, mistcloakGully).toBeIn("arena");
  });

  it("happy: the first attack that targets you each turn gets -1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: enigma,
        arena: [mistcloakGully],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: a later attack the same turn is not reduced", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: enigma,
        arena: [mistcloakGully],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(3);
    game.as(enigma).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: end phase destroys this unless you pitched, played, or defended with blue", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arena: [mistcloakGully],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Enigma, mistcloakGully).toBeIn("graveyard");
  });

  it("timing: a blue card in pitch this turn keeps this in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arena: [mistcloakGully],
        pitch: [innerChiBlue],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Enigma, mistcloakGully).toBeIn("arena");
  });
});
