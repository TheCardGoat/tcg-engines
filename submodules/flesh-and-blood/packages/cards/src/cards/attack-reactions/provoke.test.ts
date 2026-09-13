import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { snatchRed } from "../actions/snatch.ts";
import { provokeBlue } from "./provoke.ts";

describe("Provoke (HNT117) AAA", () => {
  it("happy: weapon attack reveals an action from the defending hero's hand and adds it as a defender", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [provokeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.activate(dawnblade);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(provokeBlue);
    game.passBoth();
    Dash.target(snatchRed);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expectFabCard(Dash, snatchRed).toBeIn("combatChain");
  });

  it("boundary: revealed non-action is discarded", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [provokeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [lightningPressRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.activate(dawnblade);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(provokeBlue);
    game.passBoth();
    Dash.target(lightningPressRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, lightningPressRed).toBeIn("graveyard");
  });

  it("boundary: an attack-action chain link does not reveal", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [provokeBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [lightningPressRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(provokeBlue);
    game.passBoth();

    expectFabCard(Dash, lightningPressRed).toBeIn("hand");
  });
});
