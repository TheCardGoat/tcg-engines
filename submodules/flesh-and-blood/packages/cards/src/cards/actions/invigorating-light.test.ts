import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { invigoratingLightRed } from "./invigorating-light.ts";

/**
 * Invigorating Light, Red (BOL024) — Light Warrior Action - Attack,
 * cost 3, 6{p}.
 * Printed: "When you play Invigorating Light, if there are no cards in
 * your hero's soul, put it into your hero's soul when the combat chain
 * closes."
 */

describe("Invigorating Light, Red (BOL024) AAA", () => {
  it("happy: with an empty soul the attack settles into the soul at chain close", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [invigoratingLightRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(invigoratingLightRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Boltyn, invigoratingLightRed).toBeIn("soul");
  });

  it("boundary: a second Light graves once the soul is occupied", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [invigoratingLightRed, invigoratingLightRed],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(invigoratingLightRed);
    game.helpers.resolveRestOfCombat();
    Boltyn.playAttack(invigoratingLightRed);
    game.helpers.resolveRestOfCombat();

    expect(Boltyn.zone("soul")).toHaveLength(1);
    expect(
      Boltyn.zone("graveyard").filter((id) => id === invigoratingLightRed.canonicalId),
    ).toHaveLength(1);
  });

  it("timing: the soul seating happens only at chain close", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [invigoratingLightRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(invigoratingLightRed, { stopAt: "on-attack" });

    expect(Boltyn.zone("soul")).toHaveLength(0);
  });
});
