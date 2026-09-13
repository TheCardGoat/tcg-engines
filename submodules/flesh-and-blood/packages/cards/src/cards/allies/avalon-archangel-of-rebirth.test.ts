import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { headShotYellow } from "../shared/test-recipients.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { avalonArchangelOfRebirth } from "./avalon-archangel-of-rebirth.ts";

/**
 * Avalon, Archangel of Rebirth (DTD009) — Light Angel Ally 4{p}/4{h}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   When Avalon attacks, you may banish a card from your hero's soul. If you do,
 *   put a yellow card from your graveyard on top of your deck.
 *   Ward 4
 */

describe("Avalon, Archangel of Rebirth (DTD009) AAA", () => {
  it("happy: soul banish puts a yellow graveyard card on top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [avalonArchangelOfRebirth],
        soul: [nimblismBlue],
        graveyard: [headShotYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(avalonArchangelOfRebirth, {
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(4);

    expectFabCard(Prism, nimblismBlue).toBeIn("banished");
    expect(Prism.zone("deck").at(-1)).toBe(headShotYellow.canonicalId);
  });

  it("boundary: declining soul banish leaves the yellow card in graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [avalonArchangelOfRebirth],
        soul: [nimblismBlue],
        graveyard: [headShotYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(avalonArchangelOfRebirth, { optionals: "decline" });

    expectFabCard(Prism, nimblismBlue).toBeIn("soul");
    expectFabCard(Prism, headShotYellow).toBeIn("graveyard");
  });

  it("timing: once-per-turn Attack cannot activate a second time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        arena: [avalonArchangelOfRebirth],
        soul: [nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activateAttack(avalonArchangelOfRebirth, { optionals: "decline" });
    game.closeCombat();

    expect(() => Prism.activateAttack(avalonArchangelOfRebirth)).toThrow();
    expectFabCard(Prism, avalonArchangelOfRebirth).toBeIn("arena");
  });
});
