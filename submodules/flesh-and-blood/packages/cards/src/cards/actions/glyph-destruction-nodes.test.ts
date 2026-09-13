import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { sigilOfProtectionYellow } from "./sigil-of-protection.ts";
import { glyphDestructionNodesYellow } from "./glyph-destruction-nodes.ts";

/**
 * Glyph Destruction Nodes (PEN111) — Wizard Action, cost 0, 3 arcane to up to X
 * heroes/allies where X is Sigil auras you control.
 */

describe("Glyph Destruction Nodes (PEN111) AAA", () => {
  it("happy: one Sigil aura deals 3 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [glyphDestructionNodesYellow],
        arena: [sigilOfProtectionYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(glyphDestructionNodesYellow, { targetInstanceId: Dash.ref(dash).instanceId });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Blaze, glyphDestructionNodesYellow).toBeIn("graveyard");
  });

  it("boundary: X=0 deals no damage and still resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [glyphDestructionNodesYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(glyphDestructionNodesYellow);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Blaze, glyphDestructionNodesYellow).toBeIn("graveyard");
  });

  it("timing: up to X may choose no hero even with a Sigil in play", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [glyphDestructionNodesYellow],
        arena: [sigilOfProtectionYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(glyphDestructionNodesYellow);
    Blaze.target();
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Blaze, glyphDestructionNodesYellow).toBeIn("graveyard");
  });
});
