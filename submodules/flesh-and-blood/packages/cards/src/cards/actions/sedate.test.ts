import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { sedateRed } from "./sedate.ts";

describe("Sedate family AAA", () => {
  it("happy: when this hits a hero, create an Inertia token under their control", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [sedateRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(sedateRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Dash.zone("arena")).toContain("token:inertia");
    expect(game.combat()).toBeNull();
  });

  it("boundary: a miss creates no Inertia token", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [sedateRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(sedateRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("arena")).not.toContain("token:inertia");
  });

  it("timing: the Inertia token is under the hit hero's control", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [sedateRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(sedateRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arena")).toContain("token:inertia");
    expect(Arakni.zone("arena")).not.toContain("token:inertia");
  });
});
