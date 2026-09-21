import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blinkBlue } from "../instants/blink.ts";
import { cosmicFlareRed } from "../instants/cosmic-flare.ts";
import { brutalAssaultBlue, briar } from "../shared/test-recipients.ts";
import { overchargeRed } from "./overcharge.ts";

/**
 * Overcharge, Red (PEN243) — Lightning Action - Attack, cost 1, 1{p}, 3{d},
 * go again.
 *
 * Printed: "If you've played an instant card this chain link, this gets +3{p}.
 * Go again"
 *
 * The +3 is a resolution ability, so an instant played in this link's reaction
 * step is too late. Pin the missing buff; printed 1{p} and go again remain
 * public.
 */

describe("Overcharge (PEN243) AAA", () => {
  it("happy: without an instant this chain link it attacks at printed 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [overchargeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(overchargeRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(1);
    expectFabCard(Briar, overchargeRed).toBeIn("combatChain");
  });

  it("happy: an instant in this chain-link's reaction step grants +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [overchargeRed, cosmicFlareRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(overchargeRed);
    game.advanceCombatTo("reaction");
    Briar.play(cosmicFlareRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Briar, cosmicFlareRed).toBeIn("graveyard");
  });

  it("boundary: the defender's instant does not grant +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [overchargeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [blinkBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(overchargeRed);
    game.toReaction("defender");
    Dash.play(blinkBlue);
    game.passBoth();

    // Printed: "If you've played an instant card this chain link" — the
    // defending hero's instant is not Briar's play.
    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Dash, blinkBlue).toBeIn("graveyard");
  });

  it("timing: go again refunds an action point after the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [overchargeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expectFabPlayer(Briar).toHaveAP(1);
    Briar.playAttack(overchargeRed);
    game.closeCombat();
    expectFabPlayer(Briar).toHaveAP(1);
    expectFabCard(Briar, overchargeRed).toBeIn("graveyard");
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: briar, hand: [overchargeRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Briar.defendWith([overchargeRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveLife(19);
    expectFabCard(Briar, overchargeRed).toBeIn("graveyard");
  });
});
