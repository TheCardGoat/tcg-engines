import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { battlefrontBastionRed } from "./battlefront-bastion.ts";

describe("Battlefront Bastion family AAA", () => {
  it("happy: the red attack has printed 7 power", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [battlefrontBastionRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    Fai.attackWith(battlefrontBastionRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Fai, battlefrontBastionRed).toBeIn("graveyard");
  });
  it("boundary: defending alone prevents the next damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: fai, hand: [battlefrontBastionRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);
    Dash.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Fai.defendWith(battlefrontBastionRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveLife(19);
  });
  it("timing: defending with a partner does not arm prevention", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: fai, hand: [battlefrontBastionRed, brutalAssaultBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);
    Dash.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Fai.defendWith([battlefrontBastionRed, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveLife(20);
  });
});
