import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { evoAtomBreakerRed } from "../instants/evo-atom-breaker.ts";
import { blastRigRed } from "./blast-rig.ts";

describe("Blast Rig (PEN064) AAA", () => {
  it("happy: +1{p} per equipped Evo (two Evos → 3 power)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        chest: [evoAtomBreakerRed],
        hand: [blastRigRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(blastRigRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(fai)).toHaveLife(17);
    expectFabCard(Dash, blastRigRed).toBeIn("graveyard");
  });

  it("boundary: with no Evos equipped it attacks for printed 1", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [blastRigRed], actionPoints: 1, deck: 6 },
      { hero: fai, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).attackWith(blastRigRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(fai)).toHaveLife(19);
  });

  it("timing: Evo Upgrade is live on declaration, not after chain close", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        hand: [blastRigRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).attackWith(blastRigRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });
});
