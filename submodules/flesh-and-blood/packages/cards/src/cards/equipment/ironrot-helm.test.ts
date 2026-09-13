import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ironrotHelm } from "./ironrot-helm.ts";

describe("Ironrot Helm (KSU005) AAA", () => {
  it("happy: Blade Break destroys the helm after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, head: [ironrotHelm], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(ironrotHelm);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, ironrotHelm).toBeIn("graveyard");
  });

  it("boundary: no activated abilities — cannot be activated", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [ironrotHelm], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    expect(() => game.as(bravo).activate(ironrotHelm)).toThrow();
    expectFabCard(game.as(bravo), ironrotHelm).toBeIn("head");
    expectFabCard(game.as(bravo), ironrotHelm).toHaveKeyword("blade-break");
    expectFabCard(game.as(bravo), ironrotHelm).toHaveDefense(1);
  });

  it("timing: unused helm stays equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [ironrotHelm], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();

    expectFabCard(Bravo, ironrotHelm).toBeIn("head");
    expectFabCard(Bravo, ironrotHelm).toHaveDefense(1);
  });
});
