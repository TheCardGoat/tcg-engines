import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";
import { sirensOfSafeHarborRed } from "./sirens-of-safe-harbor.ts";

describe("Sirens of Safe Harbor (SEA226) AAA", () => {
  it("happy: resolving the attack puts this into the graveyard and gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sirensOfSafeHarborRed],
        life: 20,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(sirensOfSafeHarborRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Briar, sirensOfSafeHarborRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveLife(21);
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: discarding this from hand still gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [wreckerRompRed, sirensOfSafeHarborRed],
        life: 20,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(wreckerRompRed);
    expectFabCard(Briar, sirensOfSafeHarborRed).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveLife(21);
  });
});
