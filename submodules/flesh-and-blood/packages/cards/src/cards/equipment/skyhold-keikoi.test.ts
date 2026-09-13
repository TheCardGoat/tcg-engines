import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { snatchRed } from "../actions/snatch.ts";
import { skyholdKeikoi } from "./skyhold-keikoi.ts";

/**
 * Skyhold Keikoi — Mystic Arms, Cloaked.
 *
 * Printed: "Cloaked / Instant - Destroy this: Prevent the next 1 damage that
 * would be dealt to you this turn. Activate this ability only while this is
 * face-down."
 *
 * Owns the "this turn" clause: the shield expires with the turn, so damage on
 * a later turn lands in full.
 */

describe("Skyhold Keikoi (MST073) AAA", () => {
  it("boundary: its prevention ability cannot be activated while face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arms: [{ card: skyholdKeikoi, state: { faceUp: true } }],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.expectActivationRejected(skyholdKeikoi);
    expectFabCard(Enigma, skyholdKeikoi).toBeIn("arms").toBeFaceUp();
  });

  it("happy: the shield survives the keikoi's own destruction but expires with the turn", () => {
    const game = FabTestEngine.start(
      { hero: enigma, arms: [skyholdKeikoi], life: 20, hand: [], deck: 6 },
      {
        hero: dash,
        hand: [volticBoltRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    // Turn 1 (Dash): activate in response — the prevention still applies even
    // though paying the cost destroyed the keikoi.
    Dash.play(volticBoltRed, { target: Enigma.id });
    Dash.pass();
    Enigma.activate(skyholdKeikoi);
    game.passBoth();
    game.helpers.resolveUntilIdle();
    expectFabCard(Enigma, skyholdKeikoi).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(16); // 5 arcane - 1 prevented

    // Turn 2 (Enigma), then turn 3 (Dash): the shield is gone with the turn.
    Dash.endTurn();
    game.untilIdle();
    Enigma.endTurn();
    game.untilIdle();

    Dash.playAttack(snatchRed);
    Enigma.defendWith();
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Enigma).toHaveLife(12); // full 4{p} on the later turn
  });
});
