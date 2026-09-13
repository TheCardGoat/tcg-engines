import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggy } from "../heroes/zyggy.ts";
import { sigilOfLightningBlue } from "./sigil-of-lightning.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { flickerRealityBlue } from "./flicker-reality.ts";

/**
 * Flicker Reality (OMN005) — Lightning Illusionist Instant Aura, Ward 1.
 *
 * Printed: When this leaves the arena, you may banish another Lightning aura
 * permanent you control with no holo counters, then return it to the arena
 * with a holo counter.
 *
 * Blur Reality already proves the banish-return-holo sequence as a playable
 * Instant. This trio proves the same sequence as a leave-arena trigger after
 * Ward destroys Flicker.
 */

describe("Flicker Reality (OMN005) AAA", () => {
  it("happy: leaving the arena holos another Lightning aura", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: zyggy,
        arena: [flickerRealityBlue, sigilOfLightningBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zyggy = game.as(zyggy);

    Dash.playAttack(brutalAssaultBlue);
    game.closeCombat({
      optionals: "accept",
      entityTargets: "minimum",
      ordering: "listed",
    });

    expectFabCard(Zyggy, flickerRealityBlue).toBeIn("graveyard");
    expectFabCard(Zyggy, sigilOfLightningBlue).toBeIn("arena").toHaveCounters(1, "holo");
    expectFabPlayer(Zyggy).toHaveLife(17); // Ward 1 vs Brutal Assault 4{p}
  });

  it("boundary: declining the leave-arena may leaves the other aura unholo'd", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: zyggy,
        arena: [flickerRealityBlue, sigilOfLightningBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zyggy = game.as(zyggy);

    Dash.playAttack(brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Zyggy, flickerRealityBlue).toBeIn("graveyard");
    expectFabCard(Zyggy, sigilOfLightningBlue).toBeIn("arena").toHaveCounters(0, "holo");
  });

  it("boundary: an already-holo Lightning aura is not a legal leave-arena target", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: zyggy,
        arena: [
          flickerRealityBlue,
          { card: sigilOfLightningBlue, state: { namedCounters: { holo: 1 } } },
        ],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zyggy = game.as(zyggy);

    Dash.playAttack(brutalAssaultBlue);
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabCard(Zyggy, flickerRealityBlue).toBeIn("graveyard");
    expectFabCard(Zyggy, sigilOfLightningBlue).toBeIn("arena").toHaveCounters(1, "holo");
  });
});
