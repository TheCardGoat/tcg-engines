import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { enigma } from "../heroes/enigma.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { skybodyKeikoi } from "./skybody-keikoi.ts";

/**
 * Skybody Keikoi — Mystic Chest, Cloaked.
 *
 * Printed: "Cloaked / Instant - Destroy this: Prevent the next 1 damage that
 * would be dealt to you this turn. Activate this ability only while this is
 * face-down."
 */

describe("Skybody Keikoi (MST072) AAA", () => {
  it("happy: activating the face-down chest prevents 1 of the next damage", () => {
    const game = FabTestEngine.start(
      { hero: enigma, chest: [skybodyKeikoi], life: 20, hand: [], deck: 6 },
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: blazeFiremind },
    );
    const Enigma = game.as(enigma);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Enigma.id });
    Blaze.pass();
    Enigma.activate(skybodyKeikoi);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, skybodyKeikoi).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(16); // 5 arcane - 1 prevented
  });

  it("boundary: a face-up keikoi cannot be activated and nothing is prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        chest: [{ card: skybodyKeikoi, state: { faceDown: false } }],
        life: 20,
        hand: [],
        deck: 6,
      },
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: blazeFiremind },
    );
    const Enigma = game.as(enigma);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Enigma.id });
    Blaze.pass();
    Enigma.expectActivationRejected(skybodyKeikoi);
    Enigma.pass();
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, skybodyKeikoi).toBeIn("chest");
    expectFabPlayer(Enigma).toHaveLife(15); // full 5 arcane
  });
});
