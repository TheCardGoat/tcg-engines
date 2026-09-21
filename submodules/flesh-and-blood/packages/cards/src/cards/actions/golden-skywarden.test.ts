import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "./hyper-driver.ts";
import { puffin } from "../heroes/puffin.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { nimblismBlue } from "./nimblism.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { goldenSkywardenYellow } from "./golden-skywarden.ts";

/**
 * Golden Skywarden (SEA004) — Pirate Mechanologist Action Attack, 7{p} 2{d}.
 *
 * Printed: Galvanize — When this defends, you may destroy an item you
 * control. If you do, this gets +1{d}. If a Golden Cog is destroyed this
 * way, create a Gold token and repeat this process.
 *
 * Same destroyed-this-way Golden Cog compare-amount as PEN165; repeat
 * until declined is the printed "repeat this process" after a Cog.
 */

describe("Golden Skywarden (SEA004) AAA", () => {
  it("happy: each Golden Cog destroyed this way creates a Gold and repeats", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: puffin,
        hand: [goldenSkywardenYellow],
        arena: [goldenCog, goldenCog],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    const cogs = Puffin.cardsIn("arena", goldenCog);
    game.as(bravo).playAttack(snatchRed);
    Puffin.defendWith(goldenSkywardenYellow);
    game.advanceToDecision(Puffin, "boolean");
    Puffin.accept();
    game.advanceToDecision(Puffin, "entity-target");
    Puffin.target(cogs[0]!);

    // The complete first iteration must resolve before the next offer.
    expectFabCard(Puffin, goldenSkywardenYellow).toHaveDefense(3);
    expectFabPlayer(Puffin).toHaveTokenCount("gold", 1);
    expectFabPlayer(Puffin).toHaveTokenCount("golden-cog", 1);
    game.advanceToDecision(Puffin, "boolean");
    Puffin.accept();
    game.advanceToDecision(Puffin, "entity-target");
    Puffin.target(cogs[1]!);

    expectFabCard(Puffin, goldenSkywardenYellow).toHaveDefense(4);
    expectFabPlayer(Puffin).toHaveTokenCount("gold", 2);
    expectFabPlayer(Puffin).toHaveTokenCount("golden-cog", 0);
    game.advanceToDecision(Puffin, "boolean");
    Puffin.decline();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Puffin, goldenSkywardenYellow).toHaveDefense(4);
    expectFabPlayer(Puffin).toHaveTokenCount("gold", 2);
    game.closeCombat();
    expectFabPlayer(Puffin).toHaveLife(20);
    expectFabCard(Puffin, goldenSkywardenYellow).toBeIn("graveyard").toHaveDefense(2);
    expectWait(game).toBeIdle();
  });

  it("boundary: a non-Cog item grants +1{d} and does not create Gold or repeat", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: puffin,
        hand: [goldenSkywardenYellow],
        arena: [hyperDriverRed, goldenCog],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    game.as(bravo).playAttack(snatchRed);
    Puffin.defendWith(goldenSkywardenYellow);
    game.advanceToDecision(Puffin, "boolean");
    Puffin.accept();
    game.advanceToDecision(Puffin, "entity-target");
    Puffin.target(hyperDriverRed);
    game.advanceUntil({
      stopAt: "reaction",
      optionals: "throw",
      entityTargets: "pause",
      ordering: "listed",
    });
    expectWait(game).notToHaveDecision();

    expectFabCard(Puffin, goldenSkywardenYellow).toHaveDefense(3);
    expectFabPlayer(Puffin).toHaveTokenCount("gold", 0);
    expectFabCard(Puffin, hyperDriverRed).toBeIn("graveyard");
    expectFabPlayer(Puffin).toHaveTokenCount("golden-cog", 1);
    game.closeCombat();
    expectFabPlayer(Puffin).toHaveLife(19);
    expectFabCard(Puffin, goldenSkywardenYellow).toBeIn("graveyard").toHaveDefense(2);
    expectWait(game).toBeIdle();
  });

  it("timing: declining the first optional creates no Gold and does not repeat", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: puffin,
        hand: [goldenSkywardenYellow],
        arena: [goldenCog, goldenCog],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    game.as(bravo).playAttack(snatchRed);
    Puffin.defendWith(goldenSkywardenYellow);
    game.advanceToDecision(Puffin, "boolean");
    Puffin.decline();
    game.untilIdle({ optionals: "throw", entityTargets: "pause", ordering: "listed" });
    expectWait(game).notToHaveDecision();

    expectFabCard(Puffin, goldenSkywardenYellow).toHaveDefense(2);
    expectFabPlayer(Puffin).toHaveTokenCount("gold", 0);
    expectFabPlayer(Puffin).toHaveTokenCount("golden-cog", 2);
    game.closeCombat();
    expectFabPlayer(Puffin).toHaveLife(18);
  });
});
