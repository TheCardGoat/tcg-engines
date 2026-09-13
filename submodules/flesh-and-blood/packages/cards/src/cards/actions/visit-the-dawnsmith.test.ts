import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { anothos } from "../weapons/anothos.ts";
import { bravo } from "../heroes/bravo.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { visitTheDawnsmithBlue } from "./visit-the-dawnsmith.ts";

describe("Visit the Dawnsmith (AHA026) AAA", () => {
  it("happy: start of your turn destroys this and sharpens swords you control", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: dorinthea,
        arena: [visitTheDawnsmithBlue],
        weapon1: [dawnblade],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Dori, visitTheDawnsmithBlue).toBeIn("graveyard");
    expectFabCard(Dori, dawnblade).toHavePower(4);
  });

  it("boundary: a non-sword weapon is not sharpened", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [visitTheDawnsmithBlue],
        weapon1: [anothos],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Bravo, visitTheDawnsmithBlue).toBeIn("graveyard");
    expectFabCard(Bravo, anothos).toHavePower(4);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        arena: [visitTheDawnsmithBlue],
        weapon1: [cintariSaber],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dorinthea).endTurn();
    game.untilIdle();
    expectFabCard(game.as(dorinthea), visitTheDawnsmithBlue).toBeIn("arena");
  });
});
