import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { pursueToTheEdgeOfOblivionRed } from "./pursue-to-the-edge-of-oblivion.ts";

describe("Pursue to the Edge of Oblivion (HNT224) AAA", () => {
  it("happy: hitting a hero marks them", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [pursueToTheEdgeOfOblivionRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(pursueToTheEdgeOfOblivionRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabPlayer(Bravo).toBeMarked();
  });

  it("boundary: a miss does not mark the defending hero", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [pursueToTheEdgeOfOblivionRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [wreckerRompBlue, wreckerRompBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(pursueToTheEdgeOfOblivionRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([wreckerRompBlue, wreckerRompBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).notToBeMarked();
  });
});
