import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { infectRed } from "./infect.ts";

describe("Infect (ARA008) AAA", () => {
  it("happy: when this hits a hero, create a Bloodrot Pox under their control", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [infectRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(infectRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Dash.zone("arena")).toContain("token:bloodrot-pox");
    expect(game.combat()).toBeNull();
  });

  it("boundary: a miss creates no Bloodrot Pox", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [infectRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(infectRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("arena")).not.toContain("token:bloodrot-pox");
  });

  it("timing: the Bloodrot Pox is under the hit hero's control", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [infectRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(infectRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arena")).toContain("token:bloodrot-pox");
    expect(Arakni.zone("arena")).not.toContain("token:bloodrot-pox");
  });
});
