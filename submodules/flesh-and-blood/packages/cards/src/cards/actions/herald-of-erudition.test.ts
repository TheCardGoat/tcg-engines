import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { pulseOfIsenloftBlue } from "../defense-reactions/pulse-of-isenloft.ts";
import { heraldOfEruditionYellow } from "./herald-of-erudition.ts";

/**
 * Herald of Erudition (MON004) — Light Illusionist Attack. Yellow cost 2, 5{p}/3{d}. Dominate, Phantasm.
 * When this hits, put it into your soul and draw 2 cards.
 */

describe("Herald of Erudition (MON004) AAA", () => {
  it("happy: when this hits, put it into soul and draw 2", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfEruditionYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
        deckTop: [snatchRed, nimblismBlue],
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(heraldOfEruditionYellow);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Prism, heraldOfEruditionYellow).toBeIn("soul");
    expect(Prism.zone("hand")).toContain(snatchRed.canonicalId);
    expect(Prism.zone("hand")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: a blocked miss does not soul this or draw", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfEruditionYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
        deckTop: [snatchRed, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        hand: [pulseOfIsenloftBlue],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfEruditionYellow);
    game.toReaction("defender");
    Dash.play(pulseOfIsenloftBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Prism, heraldOfEruditionYellow).toBeIn("graveyard");
    expect(Prism.zone("hand")).not.toContain(snatchRed.canonicalId);
  });

  it("timing: this stays on the chain until the hit resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfEruditionYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(heraldOfEruditionYellow);
    expectFabCard(Prism, heraldOfEruditionYellow).toBeIn("combatChain");
    expect(Prism.zone("soul")).toHaveLength(0);
  });
});
