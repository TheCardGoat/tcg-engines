import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { nimblismBlue } from "./nimblism.ts";
import { scourTheBattlescapeYellow } from "./scour-the-battlescape.ts";
import { spinalCrushRed } from "./spinal-crush.ts";

describe("Spinal Crush (WTR044) AAA", () => {
  it("happy: after a 4+ crush their next action-phase attack loses printed go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spinalCrushRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        arsenal: [scourTheBattlescapeYellow],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(spinalCrushRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(9);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(11);
    expectFabCard(Bravo, spinalCrushRed).toBeIn("graveyard");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.attackWith(scourTheBattlescapeYellow, { from: "arsenal" });
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Dash).toHaveAP(0);
  });

  it("boundary: 3 damage is not a crush", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spinalCrushRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        arsenal: [scourTheBattlescapeYellow],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(spinalCrushRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.attackWith(scourTheBattlescapeYellow, { from: "arsenal" });
    expect(game.combat()?.activeLink?.keywords ?? []).toContain("go-again");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("timing: exactly 4 damage still crushes", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spinalCrushRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        arsenal: [scourTheBattlescapeYellow],
        hand: [nimblismBlue, wreckerRompBlue, scourTheBattlescapeYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(spinalCrushRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, wreckerRompBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Bravo, spinalCrushRed).toBeIn("graveyard");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.attackWith(scourTheBattlescapeYellow, { from: "arsenal" });
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurnWithArsenal(scourTheBattlescapeYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.attackWith(scourTheBattlescapeYellow, { from: "arsenal" });
    expect(game.combat()?.activeLink?.keywords ?? []).toContain("go-again");
  });
});
