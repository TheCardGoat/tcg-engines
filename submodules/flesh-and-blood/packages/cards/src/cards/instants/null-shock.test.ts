import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { lubricateBlue } from "./lubricate.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { nullShockYellow } from "./null-shock.ts";

/**
 * Null // Shock (ROS023) — Wizard Instant // Lightning Instant.
 *
 * Printed: Meld. Null: negate target Instant if its cost is less than arcane
 * you've dealt this turn. Shock: deal 1 arcane to any target.
 *
 * Null's cost-lt-arcane filter is evaluated at announce, so meld cannot see
 * Shock's damage yet. Prove the playable Shock face and the Null no-target
 * boundary; do not invent a prior-arcane meld path.
 */

const cog = fabToken("golden-cog");

describe("Null // Shock (ROS023) AAA", () => {
  it("happy: Shock deals 1 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [nullShockYellow, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: teklovossen, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Teklo = game.as(teklovossen);

    Kano.play(nullShockYellow, {
      playMethod: { kind: "face", face: "right" },
      pitch: [nimblismBlue],
      targetInstanceId: Teklo.ref(teklovossen).instanceId,
    });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Teklo).toHaveLife(19);
    expectFabCard(Kano, nullShockYellow).toBeIn("graveyard");
  });

  it("boundary: Null with 0 arcane dealt this turn cannot negate a cost-0 Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [lubricateBlue],
        arena: [{ card: cog, state: { tapped: true } }],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kano,
        hand: [nullShockYellow, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Kano = game.as(kano);

    Teklo.play(lubricateBlue);
    Teklo.pass();
    expectFabUnplayable(
      () =>
        Kano.play(nullShockYellow, {
          playMethod: { kind: "face", face: "left" },
          pitch: [nimblismBlue],
          target: Teklo.findCardInZone("stack", lubricateBlue),
        }),
      /no legal target|couldn't be played/i,
    );
    expectFabCard(Teklo, lubricateBlue).toBeIn("stack");
  });

  it("timing: Shock is in the graveyard after the ping", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [nullShockYellow, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: teklovossen, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Teklo = game.as(teklovossen);

    Kano.play(nullShockYellow, {
      playMethod: { kind: "face", face: "right" },
      pitch: [nimblismBlue],
      targetInstanceId: Teklo.ref(teklovossen).instanceId,
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Kano, nullShockYellow).toBeIn("graveyard");
    expectFabPlayer(Kano).toHaveAP(1);
  });
});
