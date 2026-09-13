import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { fastingCarcassRed } from "./fasting-carcass.ts";

describe("Fasting Carcass (PEN198) AAA", () => {
  it("happy: the next red action gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fastingCarcassRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(fastingCarcassRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(1);
    expectFabCard(Briar, fastingCarcassRed).toBeIn("graveyard");

    Briar.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: the next blue action does not gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fastingCarcassRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(fastingCarcassRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Briar).toHaveAP(0);
  });
});
