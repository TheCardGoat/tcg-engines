import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { adaptivePlating } from "../equipment/adaptive-plating.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeltai } from "./tomeltai.ts";

/**
 * Tomeltai (UPR007) — Draconic Illusionist Dragon Ally, 5{p}/5{h}.
 *
 * Printed: Whenever Tomeltai attacks a hero, reveal the top 2 cards of your
 * deck. If 1 or more red cards are revealed this way, put that many -1{d}
 * counters on an equipment they control, then if it has 0{d}, destroy it.
 *
 * Dragon allies attack via Storm of Sandikai's granted Attack activation.
 */

describe("Tomeltai (UPR007) AAA", () => {
  it("happy: one red reveal reduces 1{d} equipment to 0{d} and destroys it", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [tomeltai],
        actionPoints: 1,
        deckTop: [snatchRed, nimblismBlue],
        deck: 4,
      },
      { hero: dash, chest: [adaptivePlating], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(tomeltai);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dash, adaptivePlating).toBeIn("graveyard");
  });

  it("boundary: two blue reveals leave the equipment intact", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [tomeltai],
        actionPoints: 1,
        deckTop: [nimblismBlue, nimblismBlue],
        deck: 4,
      },
      { hero: dash, chest: [adaptivePlating], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(tomeltai);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dash, adaptivePlating).toBeIn("chest");
    expectFabCard(Dash, adaptivePlating).toHaveDefense(1);
  });

  it("timing: a different attack you control does not tax their equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [tomeltai],
        hand: [snatchRed],
        actionPoints: 1,
        deckTop: [snatchRed, snatchRed],
        deck: 4,
      },
      { hero: dash, chest: [adaptivePlating], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.playAttack(snatchRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, adaptivePlating).toBeIn("chest");
  });
});
