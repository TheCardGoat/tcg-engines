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
import { spearsOfSurrealityRed } from "./spears-of-surreality.ts";

describe("Spears of Surreality (MON101) AAA", () => {
  it("happy: a 6-power attack-action defender triggers Phantasm and closes the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [spearsOfSurrealityRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [wreckerRompBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.attackWith(spearsOfSurrealityRed);
    expect(game.combat()?.activeLink?.keywords).toEqual(
      expect.arrayContaining(["phantasm", "go-again"]),
    );
    game.advanceCombatTo("defend");
    Dash.defendWith(wreckerRompBlue);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabCard(Zyggy, spearsOfSurrealityRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
    expect(game.combat()).toBeNull();
  });

  it("boundary: a 4-power attack-action defender does not trigger Phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [spearsOfSurrealityRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.attackWith(spearsOfSurrealityRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Zyggy, spearsOfSurrealityRed).toBeIn("graveyard");
  });

  it("timing: go again still refunds when Phantasm does not trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [spearsOfSurrealityRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(spearsOfSurrealityRed);
    expectFabPlayer(Zyggy).toHaveAP(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zyggy).toHaveAP(1);
  });
});
