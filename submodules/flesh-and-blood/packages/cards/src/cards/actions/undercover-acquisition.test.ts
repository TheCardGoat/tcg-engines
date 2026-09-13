import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { gold } from "../tokens/gold.ts";
import { nimblismBlue } from "./nimblism.ts";
import { undercoverAcquisitionRed } from "./undercover-acquisition.ts";

describe("Undercover Acquisition (SEA249) AAA", () => {
  it("happy: hit steals an item they control", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [undercoverAcquisitionRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, arena: [gold], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(undercoverAcquisitionRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Dash.zone("arena")).not.toContain(gold.canonicalId);
    expect(Arakni.zone("arena")).toContain(gold.canonicalId);
  });

  it("boundary: a miss does not steal an item", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [undercoverAcquisitionRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        arena: [gold],
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(undercoverAcquisitionRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("arena")).toContain(gold.canonicalId);
    expect(Arakni.zone("arena")).not.toContain(gold.canonicalId);
  });

  it("timing: stolen item returns at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [undercoverAcquisitionRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, arena: [gold], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(undercoverAcquisitionRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expect(Arakni.zone("arena")).toContain(gold.canonicalId);

    Arakni.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Dash.zone("arena")).toContain(gold.canonicalId);
    expect(Arakni.zone("arena")).not.toContain(gold.canonicalId);
  });

  it("timing: stolen item is controlled by the attacker while the turn is still open", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [undercoverAcquisitionRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, arena: [gold], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(undercoverAcquisitionRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Arakni.zone("arena")).toContain(gold.canonicalId);
    expect(Dash.zone("arena")).not.toContain(gold.canonicalId);
  });
});
