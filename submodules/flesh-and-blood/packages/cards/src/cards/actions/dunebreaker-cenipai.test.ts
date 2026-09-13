import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { prism } from "../heroes/prism.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { dunebreakerCenipaiRed } from "./dunebreaker-cenipai.ts";

/**
 * Dunebreaker Cenipai Red (DRO015) — Illusionist Attack Action. Phantasm.
 *
 * Printed: When Phantasmal Haze is destroyed, create a Spectral Shield
 * token.
 */

describe("Phantasmal Haze (DRO015) AAA", () => {
  it("happy: phantasm-destroyed by a 6{p} attack action, a Shield is created", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [dunebreakerCenipaiRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [brutalAssaultRed], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Bravo = game.as(bravo);

    Prism.playAttack(dunebreakerCenipaiRed);
    game.advanceUntil({ stopAt: "defend" });
    Bravo.defendWith(brutalAssaultRed); // 6{p} AAC: phantasm fires
    game.helpers.resolveUntilIdle();

    expectFabToken(game, "ash").toHaveCount(1);
  });

  it("boundary: defended by a non-attack card, no destroy and no token", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [dunebreakerCenipaiRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Bravo = game.as(bravo);

    Prism.playAttack(dunebreakerCenipaiRed);
    game.advanceUntil({ stopAt: "defend" });
    Bravo.defendWith(nimblismBlue); // non-attack action card
    game.helpers.resolveUntilIdle();

    expectFabToken(game, "ash").toHaveCount(0);
    expectFabPlayer(Bravo).toHaveLife(17); // 20 - (power - 2 nimblism block)
  });
});
