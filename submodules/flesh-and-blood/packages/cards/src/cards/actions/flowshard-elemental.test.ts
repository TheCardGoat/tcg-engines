import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { livewirePressRed } from "../instants/livewire-press.ts";
import { flowshardElementalRed } from "./flowshard-elemental.ts";

/**
 * Flowshard Elemental (OMN149) — Lightning Action - Attack, cost 0, 4{p}, go again.
 *
 * Printed: When this attacks, you may discard an instant card. If you do,
 * create a Lightning Flow token and this gets go again.
 */

describe("Flowshard Elemental (OMN149) AAA", () => {
  it("happy: discarding an instant creates a Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [flowshardElementalRed, livewirePressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(flowshardElementalRed, { stopAt: "on-attack" });
    Briar.accept();
    Briar.target(livewirePressRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(Briar).toHaveTokenCount("lightning-flow", 1);
    expectFabCard(Briar, livewirePressRed).toBeIn("graveyard");
  });

  it("boundary: with no instant, the discard boolean does not open", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [flowshardElementalRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(flowshardElementalRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(Briar).toHaveTokenCount("lightning-flow", 0);
  });

  it("timing: declining the discard creates no Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [flowshardElementalRed, livewirePressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(flowshardElementalRed, { stopAt: "on-attack" });
    Briar.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expectFabCard(Briar, livewirePressRed).toBeIn("hand");
    expectFabPlayer(Briar).toHaveTokenCount("lightning-flow", 0);
  });
});
