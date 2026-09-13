import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { snatchRed } from "../actions/snatch.ts";
import { frailtyTrapRed } from "./frailty-trap.ts";

/**
 * Frailty Trap Red (OUT172) — Assassin / Ranger Defense Reaction Trap.
 *
 * Printed: When this defends an attack with go again, create a Frailty token
 * under the attacking hero's control.
 */

describe("Frailty Trap (OUT172) family behavior AAA", () => {
  it("happy: defending a go-again attack creates a Frailty under the attacker", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [phoenixFlameRed], actionPoints: 1, deck: 6 },
      { hero: arakni, hand: [frailtyTrapRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);

    Dash.attackWith(phoenixFlameRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Arakni.play(frailtyTrapRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arena")).toContain("token:frailty");
    expectFabCard(Arakni, frailtyTrapRed).toBeIn("graveyard");
  });

  it("boundary: defending an attack without go again does not create Frailty", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: arakni, hand: [frailtyTrapRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Arakni.play(frailtyTrapRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arena")).not.toContain("token:frailty");
    expectFabPlayer(Arakni).toHaveLife(19);
  });
});
