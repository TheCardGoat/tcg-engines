import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { unravelAggressionBlue } from "./unravel-aggression.ts";

describe("Unravel Aggression (MST078) AAA", () => {
  it("happy: pitching a Chi to play this draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: enigma,
        hand: [unravelAggressionBlue, innerChiBlue],
        deckTop: [nimblismBlue],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    Enigma.play(unravelAggressionBlue, { pitch: [innerChiBlue] });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Enigma, innerChiBlue).toBeIn("pitch");
    expectFabCard(Enigma, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Enigma).toHaveLife(20);
  });

  it("boundary: pitching a non-Chi blue does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: enigma,
        hand: [unravelAggressionBlue, brutalAssaultBlue],
        deckTop: [nimblismBlue],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    Enigma.play(unravelAggressionBlue, { pitch: [brutalAssaultBlue] });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Enigma, brutalAssaultBlue).toBeIn("pitch");
    expect(Enigma.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Enigma).toHaveLife(20);
  });

  it("timing: 5{d} still defends after the Chi pitch", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: enigma,
        hand: [unravelAggressionBlue, innerChiBlue],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    Enigma.play(unravelAggressionBlue, { pitch: [innerChiBlue] });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Enigma).toHaveLife(20);
    expectFabCard(Enigma, unravelAggressionBlue).toBeIn("graveyard");
  });
});
