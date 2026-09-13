import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { snatchRed } from "./snatch.ts";
import { riftSkitterRed } from "./rift-skitter.ts";
import { putridStirringsRed } from "./putrid-stirrings.ts";
import { putridStirringsBlue } from "./putrid-stirrings.ts";

describe("Putrid Stirrings (DTD161) AAA", () => {
  it("happy: you may play this from banished and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [putridStirringsRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(putridStirringsRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Vynnset, putridStirringsRed).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveAP(1);
  });

  it("happy: the next attack action you rune gate this turn gets +5{p}", () => {
    const runechant = fabToken("runechant");
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [putridStirringsRed, riftSkitterRed],
        arena: [runechant, runechant, runechant],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(putridStirringsRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Vynnset.attackWith(riftSkitterRed, { from: "banished" });

    expect(game.combat()?.activeLink?.attackPower).toBe(9);
  });

  it("boundary: a non-rune-gated attack does not get +5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [putridStirringsRed],
        hand: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(putridStirringsRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Vynnset.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: blood debt in banished ticks at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [putridStirringsRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(vynnset).endTurn();
    expectFabPlayer(game.as(vynnset)).toHaveLife(19);
  });

  it("happy: you may play this from banished and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [putridStirringsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(putridStirringsBlue, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Vynnset, putridStirringsBlue).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveAP(1);
  });
});
