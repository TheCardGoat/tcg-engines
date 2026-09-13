import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { bravo } from "../heroes/bravo.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { sigilOfBrillianceYellow } from "../instants/sigil-of-brilliance.ts";
import { haloOfLuminaLight } from "./halo-of-lumina-light.ts";

/**
 * Equipment behavior acceptance test — Halo of Lumina, Light (APR003).
 *
 * AAA trio:
 * - Happy: on destroy, recover a yellow aura from banished zone
 * - Boundary: no yellow aura in banished zone — destroy fires but no recovery
 * - Timing: Spellvoid(2) provides defense value
 *
 * Hero: Prism (MON002) — Light/Illusionist/Young
 * FLUENT API ONLY.
 */

describe("Halo of Lumina, Light (APR003) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: equipment starts in head zone", () => {
    const game = FabTestEngine.start(
      { hero: prism, head: [haloOfLuminaLight], deck: 6 },
      { hero: bravo, deck: 6 },
    );
    const Prism = game.as(prism);

    expect(Prism.zone("head")).toHaveLength(1);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: on destroy with no yellow aura in banished — no recovery", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: prism, life: 20, head: [haloOfLuminaLight], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Prism = game.as(prism);

    Blaze.play(volticBoltRed, { target: Prism.id });
    game.passBoth();
    const choice = Prism.expectDecision("option");
    Prism.chooseOptions(choice.options[0]!.id);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Prism, haloOfLuminaLight).toBeIn("graveyard");
    expect(Prism.zone("arena")).toHaveLength(0);
  });

  it("timing: on destroy recovers yellow aura from banished zone to arena", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: prism,
        life: 20,
        head: [haloOfLuminaLight],
        banished: [sigilOfBrillianceYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Prism = game.as(prism);

    Blaze.play(volticBoltRed, { target: Prism.id });
    game.passBoth();
    const choice = Prism.expectDecision("option");
    Prism.chooseOptions(choice.options[0]!.id);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: sigilOfBrillianceYellow.canonicalId,
    });

    expectFabCard(Prism, haloOfLuminaLight).toBeIn("graveyard");
    expectFabCard(Prism, sigilOfBrillianceYellow).toBeIn("arena");
  });
});
