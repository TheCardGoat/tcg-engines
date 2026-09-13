import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { kano } from "../heroes/kano.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { snatchRed } from "./snatch.ts";
import { spectralProcessionRed } from "./spectral-procession.ts";

/**
 * Spectral Procession (DYN216) — "Spectral Procession's {p} is equal to the
 * number of Spectral Shields you control. Phantasm"
 *
 * Mode B (fab-rules): the continuous set-base power static counts Spectral
 * Shield tokens the controller owns in their arena; the card carries no
 * printed power, so the count is the entire attack power. Boundary proven
 * at zero shields, scaling at three, plus the resolution flow.
 */

describe("Spectral Procession (DYN216) AAA", () => {
  it("happy: with three Spectral Shields controlled the attack power is 3", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spectralProcessionRed],
        arena: [
          fabToken("spectral-shield"),
          fabToken("spectral-shield"),
          fabToken("spectral-shield"),
        ],
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).attackWith(spectralProcessionRed);

    expectCombat(game).toHaveAttackPower(3); // {p} = Spectral Shields controlled
  });

  it("boundary: with no Spectral Shields controlled the attack power is 0", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spectralProcessionRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).attackWith(spectralProcessionRed);

    expectCombat(game).toHaveAttackPower(0); // no shields: no printed fallback
  });

  it("timing: the shield-count power flows into combat damage on resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spectralProcessionRed],
        arena: [
          fabToken("spectral-shield"),
          fabToken("spectral-shield"),
          fabToken("spectral-shield"),
        ],
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    game.as(prism).attackWith(spectralProcessionRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Kano).toHaveLife(17); // 20 - 3 shields as damage
  });

  it("phantasm: defended by a 6{p} non-Illusionist attack action, the attack is destroyed and the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spectralProcessionRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, life: 20, hand: [wreckerRompBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    game.as(prism).attackWith(spectralProcessionRed);
    game.advanceCombatTo("defend");
    Kano.defendWith(wreckerRompBlue); // 6{p} attack action, non-Illusionist
    game.passBoth();
    game.helpers.resolveUntilIdle();

    // Phantasm: the attack never deals damage and closes the chain.
    expectFabCard(game.as(prism), spectralProcessionRed).toBeIn("graveyard");
    expectFabPlayer(Kano).toHaveLife(20);
    expect(game.combat()).toBeNull();
  });

  it("phantasm boundary: a 4{p} attack-action defender does not trigger the destruction", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spectralProcessionRed],
        arena: [
          fabToken("spectral-shield"),
          fabToken("spectral-shield"),
          fabToken("spectral-shield"),
        ],
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    game.as(prism).attackWith(spectralProcessionRed); // 3{p} with 3 shields
    game.advanceCombatTo("defend");
    Kano.defendWith(snatchRed); // 4{p} attack action: under the 6{p} threshold
    game.passBoth();
    game.helpers.resolveUntilIdle();

    // No phantasm: the link resolves normally (3{p} - 2{d} = 1 damage).
    expectFabPlayer(Kano).toHaveLife(19);
    expect(game.combat()).toBeNull();
  });
});
