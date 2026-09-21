import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "./hyper-driver.ts";
import { puffin } from "../heroes/puffin.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { nimblismBlue } from "./nimblism.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { skywardenNo161803Yellow } from "./skywarden-no-161803.ts";

/**
 * Skywarden no.161803 (PEN165) — Pirate Mechanologist Action Attack, 3{p} 2{d}.
 *
 * Printed: Galvanize — When this defends, you may destroy an item you
 * control. If you do, this gets +1{d}. If a Golden Cog is destroyed this
 * way, create a Gold token.
 *
 * The cog rider is `compare-amount` of `count` `destroyed-this-way` named
 * Golden Cog, inside `optional.then` (Adaptive Plating galvanize). Never
 * `has-status destroyed-this-way-golden-cog`.
 */

describe("Skywarden no.161803 (PEN165) AAA", () => {
  it("happy: destroying a Golden Cog while defending grants +1{d} and a Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: puffin,
        hand: [skywardenNo161803Yellow],
        arena: [goldenCog],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    game.as(bravo).playAttack(snatchRed);
    Puffin.defendWith(skywardenNo161803Yellow);
    game.advanceToDecision(Puffin, "boolean");
    Puffin.accept();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });
    expectFabPlayer(Puffin).toHaveTokenCount("golden-cog", 0);

    expectFabCard(Puffin, skywardenNo161803Yellow).toHaveDefense(3);
    expectFabPlayer(Puffin).toHaveTokenCount("gold", 1);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Puffin).toHaveLife(19);
    expectFabCard(Puffin, skywardenNo161803Yellow).toBeIn("graveyard").toHaveDefense(2);
    expectCombat(game).toBeClosed();
  });

  it("boundary: destroying a non-Cog item grants +1{d} and no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: puffin,
        hand: [skywardenNo161803Yellow],
        arena: [hyperDriverRed],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    game.as(bravo).playAttack(snatchRed);
    Puffin.defendWith(skywardenNo161803Yellow);
    game.advanceToDecision(Puffin, "boolean");
    Puffin.accept();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Puffin, skywardenNo161803Yellow).toHaveDefense(3);
    expectFabPlayer(Puffin).toHaveTokenCount("gold", 0);
    expectFabCard(Puffin, hyperDriverRed).toBeIn("graveyard");
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Puffin).toHaveLife(19);
    expectFabCard(Puffin, skywardenNo161803Yellow).toBeIn("graveyard").toHaveDefense(2);
    expectCombat(game).toBeClosed();
  });

  it("timing: declining galvanize leaves printed {d} and creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: puffin,
        hand: [skywardenNo161803Yellow],
        arena: [goldenCog],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    game.as(bravo).playAttack(snatchRed);
    Puffin.defendWith(skywardenNo161803Yellow);
    game.advanceToDecision(Puffin, "boolean");
    Puffin.decline();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });
    expectFabPlayer(Puffin).toHaveTokenCount("golden-cog", 1);

    expectFabCard(Puffin, skywardenNo161803Yellow).toHaveDefense(2);
    expectFabPlayer(Puffin).toHaveTokenCount("gold", 0);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Puffin).toHaveLife(18);
    expectFabCard(Puffin, skywardenNo161803Yellow).toBeIn("graveyard").toHaveDefense(2);
    expectWait(game).notToHaveDecision();
  });
});
