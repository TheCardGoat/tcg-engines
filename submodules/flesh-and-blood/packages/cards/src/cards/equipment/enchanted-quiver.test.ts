import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { bravo } from "../heroes/bravo.ts";
import { infectingShotRed as infectingShot } from "../actions/infecting-shot.ts";
import { enchantedQuiver } from "./enchanted-quiver.ts";

/**
 * Enchanted Quiver (HNT252) — Ranger Quiver.
 *
 * Printed: Instant - Destroy this: Prevent the next 1 arcane damage that
 * would be dealt to you this turn. If there is a face-up arrow in your
 * arsenal, instead prevent the next 2.
 *
 * DYN171 response-activation flow against Voltic Bolt's 5 arcane: the
 * prevention amount branches on a face-up arsenal arrow.
 */

describe("Enchanted Quiver (HNT252) AAA", () => {
  it("happy: with a face-up arsenal arrow the quiver prevents 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        weapon2: [enchantedQuiver],
        arsenal: [{ card: infectingShot, state: { faceDown: false } }],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Bravo.id });
    Blaze.pass();
    Bravo.activate(enchantedQuiver);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, enchantedQuiver).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(17);
  });

  it("boundary: without the arrow the quiver prevents only 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        weapon2: [enchantedQuiver],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Bravo.id });
    Blaze.pass();
    Bravo.activate(enchantedQuiver);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, enchantedQuiver).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("timing: a face-down arrow does not upgrade the prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        weapon2: [enchantedQuiver],
        arsenal: [infectingShot],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Bravo.id });
    Blaze.pass();
    Bravo.activate(enchantedQuiver);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, enchantedQuiver).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(16);
  });
});
