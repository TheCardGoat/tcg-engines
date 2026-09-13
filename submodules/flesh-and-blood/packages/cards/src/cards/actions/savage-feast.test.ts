import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { savageFeastRed } from "./savage-feast.ts";

describe("Savage Feast (RNR010) AAA", () => {
  it("happy: the additional cost discards the other 6+{p} card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [savageFeastRed, brutalAssaultRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(savageFeastRed);
    expectFabCard(Tuffnut, brutalAssaultRed).toBeIn("graveyard");
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: a 4{p} additional-cost discard is still paid", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [savageFeastRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(savageFeastRed);
    expectFabCard(Tuffnut, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Tuffnut).toHaveHandCount(0);
  });

  it("happy: discarding a 6+{p} additional cost draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [savageFeastRed, brutalAssaultRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    Tuffnut.attackWith(savageFeastRed);
    game.passBoth();
    expectFabCard(Tuffnut, brutalAssaultRed).toBeIn("graveyard");
    expectFabPlayer(Tuffnut).toHaveHandCount(1);
  });
});
