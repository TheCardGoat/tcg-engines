import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { fryRed } from "./fry.ts";
import { autumnSTouchRed } from "./autumn-s-touch.ts";

describe("Autumn's Touch (ELE128) AAA", () => {
  it("happy: vanilla Earth attack hits for printed 7", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [autumnSTouchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(autumnSTouchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Briar, autumnSTouchRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(0);
  });

  it("boundary: a Lightning attack with go again is not this vanilla Earth profile", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [fryRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(fryRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
