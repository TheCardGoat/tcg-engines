import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar, brutalAssaultBlue } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { prismaticLeylineYellow } from "./prismatic-leyline.ts";

describe("Prismatic Leyline (MST193) AAA", () => {
  it("happy: the next blue attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [prismaticLeylineYellow, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(prismaticLeylineYellow);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(brutalAssaultBlue);
    // Brutal Assault base 4 + 3 (next blue).
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: the next red attack gets +1{p}, not the blue bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [prismaticLeylineYellow, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(prismaticLeylineYellow);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(snatchRed);
    // Snatch base 4 + 1 (next red).
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("timing: go again refunds the action point spent to play the Leyline", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [prismaticLeylineYellow], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expect(Briar.actionPoints()).toBe(1);
    Briar.play(prismaticLeylineYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
