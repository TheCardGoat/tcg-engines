import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { dash } from "../heroes/dash.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { phantasmaclasmRed } from "./phantasmaclasm.ts";

describe("Phantasmaclasm (MON091) AAA", () => {
  it("happy: resolving looks at their hand, bottoms the chosen card, and they draw", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [phantasmaclasmRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: [nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.play(phantasmaclasmRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: snatchRed.canonicalId });

    expectFabPlayer(Dash).toHaveLife(11);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Zyggy, phantasmaclasmRed).toBeIn("graveyard");
  });

  it("boundary: a 6-power attack-action defender triggers Phantasm and closes the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [phantasmaclasmRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed, wreckerRompBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.play(phantasmaclasmRed);
    game.passBoth();
    Zyggy.chooseTargets(Dash.cardIn("hand", snatchRed));
    game.passBoth();
    expect(game.combat()?.activeLink?.keywords).toEqual(expect.arrayContaining(["phantasm"]));
    game.advanceCombatTo("defend");
    Dash.defendWith(wreckerRompBlue);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabCard(Zyggy, phantasmaclasmRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
    expect(game.combat()).toBeNull();
  });

  it("timing: a 4-power attack-action defender does not trigger Phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [phantasmaclasmRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.play(phantasmaclasmRed);
    game.passBoth();
    Zyggy.chooseTargets(Dash.cardIn("hand", nimblismBlue));
    game.passBoth();
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Zyggy, phantasmaclasmRed).toBeIn("graveyard");
  });
});
