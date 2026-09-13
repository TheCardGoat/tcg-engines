import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { stalagmiteBastionOfIsenloft } from "./stalagmite-bastion-of-isenloft.ts";

describe("Stalagmite, Bastion of Isenloft (EVR018) AAA", () => {
  it("happy: defending creates a Frostbite under the attacking hero", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [stalagmiteBastionOfIsenloft],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(stalagmiteBastionOfIsenloft);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("arena")).toContain("token:frostbite");
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("frostbite", 0).toHaveLife(18);
  });

  it("boundary: not defending with Stalagmite creates no Frostbite", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [stalagmiteBastionOfIsenloft],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith();
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("arena")).not.toContain("token:frostbite");
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);
    expectFabCard(Bravo, stalagmiteBastionOfIsenloft).toBeIn("weapon2");
  });

  it("timing: Frostbite is created under the attacker, not the defender", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [stalagmiteBastionOfIsenloft],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(stalagmiteBastionOfIsenloft);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("arena")).toContain("token:frostbite");
    expect(Bravo.zone("arena")).not.toContain("token:frostbite");
    expectFabCard(Bravo, stalagmiteBastionOfIsenloft).toBeIn("weapon2");
  });
});
