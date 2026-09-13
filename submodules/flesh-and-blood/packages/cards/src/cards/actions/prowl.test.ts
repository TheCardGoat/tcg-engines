import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { snatchRed } from "./snatch.ts";
import { malignRed } from "./malign.ts";
import { prowlRed } from "./prowl.ts";

/**
 * Prowl (ARA011) — Assassin Action-Attack (red).
 *
 * Printed:
 *   Stealth
 *   The next attack with stealth you play this combat chain gains +1{p}.
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when Prowl's
 *     card-layer resolves onto the chain), CR 6.2 (layer-continuous
 *     modify-numeric bound to the next matching attack), CR 7.6 (chain-link
 *     resolution — the chain stays open so the next attack becomes a new
 *     link), CR 8.3 (Stealth is a marker keyword; effects may refer to
 *     objects that have stealth), CR 2.9 (power).
 *   behaviorConstraints:
 *     - The +1{p} applies to the controller's NEXT attack with the stealth
 *       keyword played on the SAME combat chain; Prowl's own link is already
 *       on the chain when its resolution ability fires and is not buffed.
 *     - A non-stealth attack played after Prowl on the same chain receives
 *       nothing and does not consume the modifier — it waits for the next
 *       stealth attack.
 *     - The modifier lasts only while this combat chain is open; a stealth
 *       attack on a new chain is unbuffed.
 *   testImplications:
 *     - Assert Prowl's own link stays at base 3{p}; the follow-up stealth
 *       attack reads base 3 + 1 = 4; a non-stealth follow-up reads its base
 *       4 while a later stealth attack still reads 3 + 1; after the chain
 *       closes, a new-chain stealth attack reads base 3.
 */

describe("Prowl family AAA", () => {
  it("happy: the next stealth attack on the same combat chain gains +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [prowlRed, malignRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(prowlRed);
    game.advanceCombatTo("reaction");
    // Prowl's own link is not buffed by its own resolution ability: base 3.
    expectCombat(game).toHaveAttackPower(3);

    game.advanceCombatTo("resolution");
    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("defend");
    // Malign base 3 + 1 from Prowl = 4.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: a non-stealth attack gets nothing and does not consume the modifier", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [prowlRed, snatchRed, malignRed],
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(prowlRed);
    game.advanceCombatTo("resolution");

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    // Snatch has no stealth: base 4, no +1.
    expectCombat(game).toHaveAttackPower(4);

    game.advanceCombatTo("resolution");
    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("defend");
    // The modifier waited for the next STEALTH attack: base 3 + 1 = 4.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the modifier expires when the combat chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [prowlRed, malignRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(prowlRed);
    game.advanceCombatTo("resolution");
    game.closeCombat({ optionals: "decline" });
    expectCombat(game).toBeClosed();

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("defend");
    // New combat chain: the +1 died with the old chain; Malign is base 3.
    expectCombat(game).toHaveAttackPower(3);
  });
});
