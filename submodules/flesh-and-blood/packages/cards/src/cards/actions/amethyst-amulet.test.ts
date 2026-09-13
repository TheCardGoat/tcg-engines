import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { amethystAmuletBlue } from "./amethyst-amulet.ts";

describe("Amethyst Amulet (SEA189) AAA", () => {
  it("happy: Instant destroy this; next attack gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [amethystAmuletBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(amethystAmuletBlue);
    game.passBoth();
    expectFabCard(Bravo, amethystAmuletBlue).toBeIn("graveyard");

    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: a later second attack is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [amethystAmuletBlue],
        hand: [snatchRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(amethystAmuletBlue);
    game.passBoth();
    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    Bravo.playAttack(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: Instant activation does not spend an action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [amethystAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(amethystAmuletBlue);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
