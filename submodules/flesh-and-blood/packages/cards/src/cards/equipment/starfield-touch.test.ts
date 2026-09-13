import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { dash } from "../heroes/dash.ts";
import { starfieldTouch } from "./starfield-touch.ts";
import { aphrodias } from "../weapons/aphrodias.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";
import { auricShardsRed } from "../instants/auric-shards.ts";

/**
 * Starfield Touch (AZS005) — Lightning Illusionist Equipment - Arms.
 *
 * Printed: "Instant - {r}, destroy this: {u} an Aphrodias you control.
 * Battleworn"
 *
 * Distinct clause vs. its cycle: Starfield Touch untaps the Orb so it can
 * fire a second time this turn (Starfield Carapace discounts it, Starfield
 * Veil holos the next aura).
 */
describe("Starfield Touch (AZS005) AAA", () => {
  it("happy: destroying the arms untaps Aphrodias so its arcane blast fires twice", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        arms: [starfieldTouch],
        weapon1: [aphrodias],
        arena: [lightningFlow, auricShardsRed],
        hand: [],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    // Hero power seats an aura with a holo counter, licensing Aphrodias.
    Zyggy.activate(zyggyStarlight);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    Zyggy.activate(aphrodias);
    Zyggy.chooseTargetPlayers(Dash);
    game.passBoth();
    expect(Dash.life()).toBe(18);
    expectFabCard(Zyggy, aphrodias).toBeTapped();

    // {r}, destroy this: untap the Orb.
    Zyggy.activate(starfieldTouch);
    game.passBoth();
    expectFabCard(Zyggy, starfieldTouch).toBeIn("graveyard");
    expectFabCard(Zyggy, aphrodias).toBeReady();

    // The untap matters: Aphrodias fires a second time this turn.
    Zyggy.activate(aphrodias);
    Zyggy.chooseTargetPlayers(Dash);
    game.passBoth();
    expect(Dash.life()).toBe(16);
  });

  it("boundary: without the arms, the tapped Orb cannot be activated a second time", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        weapon1: [aphrodias],
        arena: [lightningFlow, auricShardsRed],
        hand: [],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.activate(zyggyStarlight);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    Zyggy.activate(aphrodias);
    Zyggy.chooseTargetPlayers(game.as(dash));
    game.passBoth();

    Zyggy.expectActivationRejected(aphrodias);
    expectFabCard(Zyggy, aphrodias).toBeTapped();
  });
});
