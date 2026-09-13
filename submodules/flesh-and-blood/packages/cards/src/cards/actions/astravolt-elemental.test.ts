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
import { astravoltElementalRed } from "./astravolt-elemental.ts";

/**
 * Astravolt Elemental (PEN241) — Lightning Action - Attack, cost 0, 3{p}.
 *
 * Printed: When this attacks, you may discard an instant card. If you do,
 * draw a card and create an Embodiment of Lightning token.
 */

describe("Astravolt Elemental (PEN241) AAA", () => {
  it("happy: discarding an instant draws and creates Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [astravoltElementalRed, livewirePressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(astravoltElementalRed, { stopAt: "on-attack" });
    Briar.accept();
    Briar.target(livewirePressRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 1).toHaveHandCount(1);
    expectFabCard(Briar, livewirePressRed).toBeIn("graveyard");
  });

  it("boundary: with no instant, no token is created", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [astravoltElementalRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(astravoltElementalRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("timing: declining the discard creates no token", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [astravoltElementalRed, livewirePressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(astravoltElementalRed, { stopAt: "on-attack" });
    Briar.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expectFabCard(Briar, livewirePressRed).toBeIn("hand");
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
  });
});
