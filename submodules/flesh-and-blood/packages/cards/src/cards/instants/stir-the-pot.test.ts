import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { stirThePotBlue } from "./stir-the-pot.ts";

describe("Stir the Pot (MST101) AAA", () => {
  it("happy: after another blue card this turn, transcend returns this to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [nimblismBlue, stirThePotBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Enigma.play(stirThePotBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, stirThePotBlue).toBeIn("hand");
  });

  it("boundary: without another blue card this turn it stays in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [stirThePotBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(stirThePotBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, stirThePotBlue).toBeIn("graveyard");
  });

  it("timing: the Instant plays with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [stirThePotBlue],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(stirThePotBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, stirThePotBlue).toBeIn("graveyard");
  });
});
