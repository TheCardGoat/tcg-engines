import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { swingBigRed } from "./swing-big.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { lunarMirageRed } from "./lunar-mirage.ts";

describe("Lunar Mirage (PEN127) AAA", () => {
  it("happy: a 6+{p} attack action defending this makes it a copy of that card", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [lunarMirageRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [swingBigRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.attackWith(lunarMirageRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(swingBigRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(8);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: a 4{p} attack action defending this does not copy", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [lunarMirageRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.attackWith(lunarMirageRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: Mirage destroys this when it defends a 6+{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [swingBigRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: zyggyStarlight, life: 40, hand: [lunarMirageRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zyggy = game.as(zyggyStarlight);

    Dash.attackWith(swingBigRed);
    game.advanceCombatTo("defend");
    Zyggy.defendWith(lunarMirageRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Zyggy, lunarMirageRed).toBeIn("graveyard");
    expectFabPlayer(Zyggy).toHaveLife(35);
  });
});
