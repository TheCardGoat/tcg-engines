import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";

import { sigilOfDeadwoodBlue } from "./sigil-of-deadwood.ts";
import { splinteringDeadwoodRed } from "./splintering-deadwood.ts";

/**
 * Splintering Deadwood (ROS121) — Runeblade Action - Attack, cost 3, 7{p}.
 *
 * Printed: When this attacks or hits, you may destroy an aura you control.
 * If you do, create a Runechant token.
 */

describe("Splintering Deadwood (ROS121) AAA", () => {
  it("happy: destroying a controlled aura on-attack creates a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [splinteringDeadwoodRed],
        arena: [sigilOfDeadwoodBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(splinteringDeadwoodRed, { stopAt: "on-attack" });
    Viserai.accept();
    Viserai.target(sigilOfDeadwoodBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2);
  });

  it("boundary: with no aura, the destroy boolean does not open", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [splinteringDeadwoodRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(splinteringDeadwoodRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
  });

  it("timing: declining the destroy leaves the aura and creates no Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [splinteringDeadwoodRed],
        arena: [sigilOfDeadwoodBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(splinteringDeadwoodRed, { stopAt: "on-attack" });
    Viserai.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat({ optionals: "decline" });
    expectFabCard(Viserai, sigilOfDeadwoodBlue).toBeIn("arena");
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
  });
});
