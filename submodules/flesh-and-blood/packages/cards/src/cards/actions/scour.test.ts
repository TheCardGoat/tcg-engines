import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { scourBlue } from "./scour.ts";

/**
 * Scour (EVR124) — Wizard Action, 3{d}.
 *
 * Printed: Destroy X target aura tokens and/or auras with cost 0 controlled
 * by target hero. Then deal arcane damage to that hero equal to the number
 * of auras destroyed this way.
 *
 * Spectral Shield (MON104) is a legal aura-token X target. On-stack
 * `count: { type: "x" }` binds from play `costBindings` (MST227). This
 * suite only proves the printed 3{d} block.
 */

const _unsupportedX = /The target count is unsupported/;

describe("Scour (EVR124) AAA", () => {
  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, hand: [scourBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Blaze.defendWith(scourBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Blaze).toHaveLife(19);
    expectFabCard(Blaze, scourBlue).toBeIn("graveyard");
  });
});
