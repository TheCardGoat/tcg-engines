import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dorintheaIronsong } from "../heroes/dorinthea-ironsong.ts";
import { dash } from "../heroes/dash.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { warriorSValorRed } from "./warrior-s-valor.ts";

describe("Warrior's Valor (WTR129) AAA", () => {
  it("happy: the next weapon attack gets +3{p} and go again when it hits", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [warriorSValorRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(warriorSValorRed);
    game.helpers.resolveUntilIdle();
    Dori.activate(dawnblade);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
    expect(game.combat()).toBeNull();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(Dori).toHaveAP(1);
  });

  it("boundary: a non-weapon attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [warriorSValorRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(warriorSValorRed);
    game.helpers.resolveUntilIdle();
    Dori.attackWith(brutalAssaultBlue);

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: a later same-turn Dawnblade attack does not keep the +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorintheaIronsong,
        weapon1: [dawnblade],
        hand: [warriorSValorRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorintheaIronsong);

    Dori.must.play(warriorSValorRed);
    game.helpers.resolveUntilIdle();
    Dori.must.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.closeCombat({ optionals: "accept", ordering: "listed" });
    Dori.must.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });
});
