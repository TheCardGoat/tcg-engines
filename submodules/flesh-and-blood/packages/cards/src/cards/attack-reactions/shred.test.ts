import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { snatchRed } from "../actions/snatch.ts";
import { prowlRed } from "../actions/prowl.ts";
import { shredRed } from "./shred.ts";

describe("Shred (DYN130) AAA", () => {
  it("happy: a card defending an Assassin attack gets -4 defense", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [prowlRed, shredRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(prowlRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(shredRed);
    game.passBoth();

    expectFabCard(Dash, snatchRed).toHaveDefense(-2);
    expectFabCard(Arakni, shredRed).toBeIn("graveyard");
  });

  it("boundary: cannot play when nothing is defending", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [prowlRed, shredRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(prowlRed);
    game.advanceCombatTo("reaction");
    expect(() => Arakni.must.playReaction(shredRed)).toThrow();
    expectFabCard(Arakni, shredRed).toBeIn("hand");
  });

  it("timing: the -4 lasts through the damage step", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [prowlRed, shredRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(prowlRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(shredRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(15);
  });
});
