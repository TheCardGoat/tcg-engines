import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { lacedLightning } from "./laced-lightning.ts";

/**
 * Laced Lightning — Lightning Legs d0.
 *
 * Printed: "Instant - {r}{r}, destroy this: Prevent the next 1 damage that
 * would be dealt to you this turn. If you prevent damage this way, create an
 * Embodiment of Lightning token."
 */

describe("Laced Lightning AAA", () => {
  it("happy: destroying the legs prevents 1 of the next damage and creates an Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        legs: [lacedLightning],
        resourcePoints: 2,
        life: 20,
        hand: [],
        deck: 6,
      },
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: blazeFiremind },
    );
    const Kano = game.as(kano);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Kano.id });
    Blaze.pass();
    Kano.activate(lacedLightning);
    game.helpers.resolveUntilIdle();

    // 5 arcane - 1 prevented, and the prevention minted the token.
    expectFabPlayer(Kano).toHaveLife(16);
    expectFabPlayer(Kano).toHaveTokenCount("embodiment-of-lightning", 1);
    expectFabCard(Kano, lacedLightning).toBeIn("graveyard");
  });

  it("boundary: the fixed prevention is spent — the next damage event is unprevented", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        legs: [lacedLightning],
        resourcePoints: 2,
        life: 20,
        hand: [],
        deck: 6,
      },
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: blazeFiremind },
    );
    const Kano = game.as(kano);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Kano.id });
    Blaze.pass();
    Kano.activate(lacedLightning);
    game.helpers.resolveUntilIdle();

    // Second 5-arcane event: no prevention left, and no second token.
    Blaze.play(volticBoltRed, { target: Kano.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kano).toHaveLife(11);
    expectFabPlayer(Kano).toHaveTokenCount("embodiment-of-lightning", 1);
  });
});
