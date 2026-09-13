import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { nimblismBlue } from "./nimblism.ts";
import { eclecticMagnetismRed } from "./eclectic-magnetism.ts";

/**
 * Eclectic Magnetism (ROS075) — Lightning Action - Attack, cost 1, 5{p}.
 *
 * Printed: When this attacks, you may play a non-attack action card this
 * chain link as though it were an instant.
 */

describe("Eclectic Magnetism (ROS075) AAA", () => {
  it("happy: on-attack may lets you play a non-attack action as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [eclecticMagnetismRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(eclecticMagnetismRed, { stopAt: "on-attack" });
    Briar.accept();
    if (game.waitState().kind === "decision") {
      Briar.target(nimblismBlue);
    }
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
  });

  it("boundary: with no non-attack action, this still attacks at 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [eclecticMagnetismRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(eclecticMagnetismRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
  });

  it("timing: declining leaves the non-attack action in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [eclecticMagnetismRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(eclecticMagnetismRed, { stopAt: "on-attack" });
    Briar.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expectFabCard(Briar, nimblismBlue).toBeIn("hand");
  });
});
