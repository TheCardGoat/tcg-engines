import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { soulShieldYellow } from "./soul-shield.ts";

describe("Soul Shield (MON063) AAA", () => {
  it("happy: after the combat chain closes this is put into soul", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: prism,
        hand: [soulShieldYellow],
        resourcePoints: 2,
        deck: 6,
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Prism.play(soulShieldYellow);
    game.passBoth();
    expectFabCard(Prism, soulShieldYellow).toHaveDefense(6);
    game.helpers.resolveRestOfCombat();

    expect(Prism.zone("soul")).toContain(soulShieldYellow.canonicalId);
    expect(Prism.zone("graveyard")).not.toContain(soulShieldYellow.canonicalId);
    expectFabPlayer(Prism).toHaveLife(20);
  });

  it("boundary: an unplayed Soul Shield stays in hand when combat closes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: prism,
        hand: [soulShieldYellow],
        resourcePoints: 2,
        deck: 6,
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Prism, soulShieldYellow).toBeIn("hand");
    expect(Prism.zone("soul")).not.toContain(soulShieldYellow.canonicalId);
    expectFabPlayer(Prism).toHaveLife(16);
  });

  it("timing: this stays on the chain until the close, then moves to soul", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: prism,
        hand: [soulShieldYellow],
        resourcePoints: 2,
        deck: 6,
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Prism.play(soulShieldYellow);
    game.passBoth();

    expectFabCard(Prism, soulShieldYellow).toBeIn("combatChain");
    expect(Prism.zone("soul")).toHaveLength(0);

    game.helpers.resolveRestOfCombat();

    expect(Prism.zone("soul")).toContain(soulShieldYellow.canonicalId);
    expect(Prism.zone("combatChain")).not.toContain(soulShieldYellow.canonicalId);
  });
});
