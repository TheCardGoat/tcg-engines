import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { channelMountIsenBlue } from "./channel-mount-isen.ts";
import { snatchRed } from "./snatch.ts";
import { runeragerSwarmRed } from "./runerager-swarm.ts";

/**
 * Runerager Swarm, Red (AUA015) — aura-conditional go again (W2-FIX2
 * removed the unprinted module `goAgain`; CRU151-class fix).
 *
 * Printed: "If you've played or created an aura this turn, this gets go
 * again." — go again is aura-conditional only and is granted by the
 * resolution ability. Proven in both directions: the action point refunds
 * after an aura this turn and does not refund without one.
 */

describe("Runerager Swarm (AUA015) AAA", () => {
  it("playline: after playing an aura this turn, the swarm refunds its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelMountIsenBlue, runeragerSwarmRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // Channel Mount Isen (cost-0 Aura action, go again) stamps the
    // played-or-created-aura-this-turn fact.
    Briar.play(channelMountIsenBlue);
    game.helpers.resolveRestOfCombat();

    Briar.playAttack(runeragerSwarmRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    // both go-agains (aura's own, swarm's) refund their spends.
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: no aura played this turn — the action point is not refunded", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [runeragerSwarmRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(runeragerSwarmRed);
    game.helpers.resolveRestOfCombat();

    // Printed go again is aura-conditional: with no aura played or created
    // this turn, the spent action point stays spent.
    expectFabPlayer(Briar).toHaveAP(0);
  });

  it("boundary: 3{p} attack; defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runeragerSwarmRed, runeragerSwarmRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith([runeragerSwarmRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveLife(19);

    Dash.endTurn();
    game.helpers.untilIdle();

    Briar.playAttack(runeragerSwarmRed);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(17);
    expect(Briar.zone("graveyard")).toContain(runeragerSwarmRed.canonicalId);
  });
});
