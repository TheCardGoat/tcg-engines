import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { runechant } from "../tokens/runechant.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { eloquentEulogyRed } from "./eloquent-eulogy.ts";

describe("Eloquent Eulogy (MST237) AAA", () => {
  it("happy: a hit closes the chain and creates an Eloquence token", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [eloquentEulogyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(eloquentEulogyRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expect(Vynnset.zone("arena")).toContain("token:eloquence");
    expectFabCard(Vynnset, eloquentEulogyRed).toBeIn("graveyard");
  });

  it("boundary: a fully blocked attack with no prior life loss creates no Eloquence", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [eloquentEulogyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.attackWith(eloquentEulogyRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, snatchRed]);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Vynnset.zone("arena")).not.toContain("token:eloquence");
  });

  it("timing: Rune Gate lets you play this from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [eloquentEulogyRed],
        arena: [runechant],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(eloquentEulogyRed, { from: "banished" });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
