/**
 * DRO002 Ash — Draconic Illusionist Token Ash.
 *
 * Printed:
 *   a1: While Ash is under an object, that object has phantasm.
 *
 * Ash has the unique behavior of being placed "under" objects (like a
 * material). While under an object, it grants the phantasm keyword to
 * its host.
 *
 * Status: proven — a real Invoke Yendurai hosts Ash through the public move
 * path; Material grants phantasm only to that host and ceases on departure.
 */
import { describe, expect, it } from "vitest";

import { ash } from "../../../../cards/src/cards/tokens/ash.ts";
import { invokeYenduraiRed } from "../../../../cards/src/cards/actions/invoke-yendurai.ts";
import { dromaiAshArtist } from "../../../../cards/src/cards/heroes/dromai-ash-artist.ts";
import { stormOfSandikai } from "../../../../cards/src/cards/weapons/storm-of-sandikai.ts";
import { miragai } from "../../../../cards/src/cards/allies/miragai.ts";
import { expectFabCard, FabTestEngine } from "../../index.ts";
import {
  bravo,
  dash,
  nimblismBlue,
  potionOfStrengthBlue,
  regurgitatingSlogRed,
  sigilOfSolaceRed,
  snatchRed,
} from "../../rules/fixtures.ts";

describe("Ash token (DRO002)", () => {
  it("card loads in arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [ash], deck: 8 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arena")).toContain(ash.canonicalId);
  });

  it("a1: real Invoke Yendurai hosts Ash and the exact host has phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        weapon1: [stormOfSandikai],
        arena: [ash],
        hand: [invokeYenduraiRed, nimblismBlue, sigilOfSolaceRed, snatchRed],
        arsenal: [snatchRed],
        resourcePoints: 1,
        deck: 8,
      },
      { hero: bravo, life: 20, hand: [regurgitatingSlogRed], deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dromai = game.as(dromaiAshArtist);
    const invocationId = game.findCardInZone(Dromai.id, "hand", invokeYenduraiRed);
    const ashId = game.findCardInZone(Dromai.id, "arena", ash);

    Dromai.exec({ move: "begin-play", payload: { instanceId: invocationId } });
    Dromai.chooseTargets(Dromai.cardIn("arena", ash));
    game.passBoth();

    expect(game.getState().containers.subcardsByHostId[invocationId]).toEqual([ashId]);
    expectFabCard(Dromai, invokeYenduraiRed).toHaveKeyword("phantasm");
    expect(Dromai.zone("arsenal")).toEqual([snatchRed.canonicalId]);

    Dromai.activate(invokeYenduraiRed);
    game.passBoth();
    game.passBoth();
    game.as(bravo).blockWith(regurgitatingSlogRed);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expect(Dromai.zone("graveyard")).toContain(invokeYenduraiRed.canonicalId);
    expect(game.as(bravo).life()).toBe(20);
    expect(game.getState().containers.subcardsByHostId[invocationId]).toBeUndefined();
    expect(game.getState().objects[ashId]).toBeUndefined();
  });

  it("a1 boundary: Ash in the arena does not grant phantasm to another object", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [ash, potionOfStrengthBlue], deck: 8 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, potionOfStrengthBlue).notToHaveKeyword("phantasm");
    expect(Bravo.zone("arena")).toContain(ash.canonicalId);
  });

  it("a1 interaction: Miragai makes the first hosted Dragon attack lose phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        weapon1: [stormOfSandikai],
        arena: [ash, miragai],
        hand: [invokeYenduraiRed, nimblismBlue, sigilOfSolaceRed, snatchRed],
        arsenal: [snatchRed],
        resourcePoints: 1,
        deck: 8,
      },
      { hero: bravo, life: 20, hand: [regurgitatingSlogRed], deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dromai = game.as(dromaiAshArtist);
    const invocationId = game.findCardInZone(Dromai.id, "hand", invokeYenduraiRed);
    Dromai.exec({ move: "begin-play", payload: { instanceId: invocationId } });
    Dromai.chooseTargets(Dromai.cardIn("arena", ash));
    game.passBoth();
    Dromai.activate(invokeYenduraiRed);
    game.passBoth();
    expectFabCard(Dromai, invokeYenduraiRed).notToHaveKeyword("phantasm");
    game.passBoth();
    game.as(bravo).blockWith(regurgitatingSlogRed);
    game.helpers.resolveRestOfCombat();

    expect(game.as(bravo).life()).toBe(19);
    expect(
      game
        .committedEvents()
        .filter(
          (event) => event.name === "destroy" && event.data.object.instanceId === invocationId,
        ),
    ).toEqual([]);
  });
});
