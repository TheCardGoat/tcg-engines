import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { funeralMoonRed } from "../actions/funeral-moon.ts";
import { spellboundCreepers } from "./spellbound-creepers.ts";

describe("Spellbound Creepers (ELE224) AAA", () => {
  it("happy: Blade Break destroys Spellbound Creepers after it defends", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: viserai, life: 20, legs: [spellboundCreepers], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    expectFabCard(Viserai, spellboundCreepers).toHaveKeyword("blade-break");

    game.as(bravo).attackWith(snatchRed);
    Viserai.defendWith(spellboundCreepers);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Viserai).toHaveLife(17);
    expectFabCard(Viserai, spellboundCreepers).toBeIn("graveyard");
  });

  it("boundary: equipment that does not defend is not destroyed", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: viserai, life: 20, legs: [spellboundCreepers], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Viserai, spellboundCreepers).toBeIn("legs");
    expectFabPlayer(Viserai).toHaveLife(16);
  });

  it("happy: after attacking with an AAC this turn, bind Instant is activatable", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        legs: [spellboundCreepers],
        hand: [snatchRed, funeralMoonRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    Viserai.activate(spellboundCreepers);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Viserai, spellboundCreepers).toHaveCounters(1, "bind");
  });

  it("boundary: without attacking or defending with an AAC this turn, bind Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        legs: [spellboundCreepers],
        hand: [funeralMoonRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    expect(() => Viserai.activate(spellboundCreepers)).toThrow();
    expectFabCard(Viserai, spellboundCreepers).toBeIn("legs");
  });
});
