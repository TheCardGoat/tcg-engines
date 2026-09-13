import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { enchantingMelodyRed } from "./enchanting-melody.ts";

describe("Enchanting Melody (ARC167) AAA", () => {
  it("happy: destroys itself and prevents 4 of the 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arena: [enchantingMelodyRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, enchantingMelodyRed).toBeIn("graveyard");
  });

  it("boundary: without damage the aura stays in the arena", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [enchantingMelodyRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(enchantingMelodyRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, enchantingMelodyRed).toBeIn("arena");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("timing: survives the play turn, then dies at end phase with no later non-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [enchantingMelodyRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.play(enchantingMelodyRed);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, enchantingMelodyRed).toBeIn("arena");

    Blaze.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, enchantingMelodyRed).toBeIn("graveyard");
  });
});
