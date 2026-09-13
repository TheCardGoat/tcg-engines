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
import { skycrestKeikoi } from "./skycrest-keikoi.ts";

/**
 * Skycrest Keikoi — Mystic Head, Cloaked.
 *
 * Printed: "Cloaked / Instant - Destroy this: Prevent the next 1 damage that
 * would be dealt to you this turn. Activate this ability only while this is
 * face-down."
 *
 * Owns the "next 1" clause: only the first damage event of the turn is
 * reduced; the prevention is consumed by it.
 */

describe("Skycrest Keikoi (MST071) AAA", () => {
  it("boundary: its prevention ability cannot be activated while face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        head: [{ card: skycrestKeikoi, state: { faceUp: true } }],
        deck: 6,
      },
      { hero: blazeFiremind, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.expectActivationRejected(skycrestKeikoi);
    expectFabCard(Enigma, skycrestKeikoi).toBeIn("head").toBeFaceUp();
  });

  it("happy: the next 1 damage is prevented once — a second damage event lands in full", () => {
    const game = FabTestEngine.start(
      { hero: enigma, head: [skycrestKeikoi], life: 20, hand: [], deck: 6 },
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: blazeFiremind },
    );
    const Enigma = game.as(enigma);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Enigma.id });
    Blaze.pass();
    Enigma.activate(skycrestKeikoi);
    game.passBoth();
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Enigma).toHaveLife(16); // 5 arcane - 1 prevented
    expectFabCard(Enigma, skycrestKeikoi).toBeIn("graveyard");

    // The active player still holds priority after resolution (CR trap).
    Blaze.play(volticBoltRed, { target: Enigma.id }); // one copy left in hand
    Blaze.pass();
    Enigma.pass();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Enigma).toHaveLife(11); // full 5 arcane, no second prevention
  });
});
