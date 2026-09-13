import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { evoSteelSoulMemoryBlue } from "../actions/evo-steel-soul-memory.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { firewallRed } from "./firewall.ts";

describe("Firewall (TCC019) AAA", () => {
  it("happy: defends for printed 4{d} and soaks a 4{p} attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [firewallRed],
        deck: [evoSteelSoulMemoryBlue, nimblismBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    Dash.defendWith(firewallRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, firewallRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [firewallRed], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(firewallRed)).toThrow();
    expectFabCard(game.as(dash), firewallRed).toBeIn("hand");
  });
});
