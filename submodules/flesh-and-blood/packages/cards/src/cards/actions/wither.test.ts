import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { witherRed } from "./wither.ts";

describe("Wither family AAA", () => {
  it("happy: when this hits a hero, create a Frailty token under their control", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [witherRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(witherRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Dash.zone("arena")).toContain("token:frailty");
    expect(game.combat()).toBeNull();
  });

  it("boundary: a miss creates no Frailty token", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [witherRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(witherRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("arena")).not.toContain("token:frailty");
  });

  it("timing: the Frailty token is under the hit hero's control", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [witherRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(witherRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arena")).toContain("token:frailty");
    expect(Arakni.zone("arena")).not.toContain("token:frailty");
  });
});
