import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { spoilsOfWarRed } from "./spoils-of-war.ts";

describe("Spoils of War (CRU084) AAA", () => {
  it("happy: the next weapon attack gains +2{p} and a hit creates 2 Copper", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [spoilsOfWarRed],
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(spoilsOfWarRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dori).toHaveAP(1);
    Dori.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
    expect(Dori.zone("arena").filter((id) => id === "token:copper")).toHaveLength(2);
  });

  it("boundary: a fully defended weapon attack creates no Copper", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [spoilsOfWarRed],
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.play(spoilsOfWarRed);
    game.helpers.resolveUntilIdle();
    Dori.activate(dawnblade);
    game.passBoth();
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Dori.zone("arena").filter((id) => id === "token:copper")).toHaveLength(0);
  });
});
