import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { passOverBlue } from "./pass-over.ts";

describe("Pass Over (MST097) AAA", () => {
  it("happy: banishes target card from the opposing graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [passOverBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, graveyard: [snatchRed], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(passOverBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(game.as(dash), snatchRed).toBeBanished();
    expectFabCard(Enigma, passOverBlue).toBeIn("graveyard");
  });

  it("boundary: with an empty opposing graveyard the Instant has no legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [passOverBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    expectFabUnplayable(() => Enigma.play(passOverBlue), /no legal target/i);
    expectFabCard(Enigma, passOverBlue).toBeIn("hand");
    expectFabCard(game.as(dash), snatchRed).toBeIn("hand");
  });

  it("timing: after another blue card this turn, transcend returns this to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [nimblismBlue, passOverBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, graveyard: [snatchRed], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Enigma.play(passOverBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(game.as(dash), snatchRed).toBeBanished();
    expectFabCard(Enigma, passOverBlue).toBeIn("hand");
  });
});
