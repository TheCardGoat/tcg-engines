/**
 * Equipment blade-break lifecycle acceptance tests.
 *
 * Implements the Equipment AAA standard from
 * docs/fab-weapons-equipment-acceptance-status.md §2 for **stat-only** equipment
 * — cards carrying only printed defense + the `bladeBreak` keyword and no
 * ability text. For these the AAA *is* the defend → defense-contribution →
 * destroy lifecycle (CR 8.3.3): defending with the equipment applies its printed
 * defense, then `bladeBreak` destroys it at chain-link close.
 *
 * The pattern is proven across all four body slots (Head, Chest, Arms, Legs)
 * with the **ironrot family** — the canonical stat-only blade-break set where
 * every piece is exactly `defense 1` + `bladeBreak` and no printed ability:
 *   - Head:  ironrot-helm     (KSU005)
 *   - Chest: ironrot-plate    (BVO005)
 *   - Arms:  ironrot-gauntlet (RNR006)
 *   - Legs:  ironrot-legs     (BVO007)
 *
 * Each slot proves: (1) seated pre-game in its legal slot, (2) its printed
 * defense reduces the incoming damage, (3) it blade-breaks to the graveyard at
 * chain close, (4) once destroyed it cannot defend again.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, type FabCardLike, type FabPlayerSetup } from "../../../../index.ts";
import { bravo, dash, ironrotHelm, snatchRed } from "../../../fixtures.ts";
import { ironrotPlate } from "../../../../../../cards/src/cards/equipment/ironrot-plate.ts";
import { ironrotGauntlet } from "../../../../../../cards/src/cards/equipment/ironrot-gauntlet.ts";
import { ironrotLegs } from "../../../../../../cards/src/cards/equipment/ironrot-legs.ts";

// snatch-red: Generic Action Attack, power 4, cost 0 — the canonical probe
// attack used across the keyword suite (e.g. 08-keywords.test.ts). Against an
// ironrot piece's printed defense 1, a defended attack deals 4 − 1 = 3 damage.
const SNATCH_POWER = 4;
const STARTING_LIFE = 20;

type BodyZone = "head" | "chest" | "arms" | "legs";

interface SlotCase {
  readonly slotName: string;
  readonly slug: string;
  readonly zone: BodyZone;
  readonly equipment: FabCardLike;
}

// One stat-only blade-break equipment per body slot.
const SLOT_CASES: readonly SlotCase[] = [
  { slotName: "Head", slug: "ironrot-helm", zone: "head", equipment: ironrotHelm },
  { slotName: "Chest", slug: "ironrot-plate", zone: "chest", equipment: ironrotPlate },
  { slotName: "Arms", slug: "ironrot-gauntlet", zone: "arms", equipment: ironrotGauntlet },
  { slotName: "Legs", slug: "ironrot-legs", zone: "legs", equipment: ironrotLegs },
];

/** Seat the ironrot equipment in its legal body slot pre-game. */
function defenderWith(zone: BodyZone, equipment: FabCardLike): FabPlayerSetup {
  const setup: FabPlayerSetup = { hero: dash, life: STARTING_LIFE, deck: 6 };
  setup[zone] = [equipment];
  return setup;
}

describe.each(SLOT_CASES)("$slotName — blade-break lifecycle ($slug)", ({ zone, equipment }) => {
  it("defends with its printed defense, then blade-breaks to the graveyard at chain close", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      defenderWith(zone, equipment),
      // action attacks are walked to the Defend step by hand (see 08-keywords).
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // Arrange — equipment is seated in its legal body slot pre-game.
    expect(Defender.zone(zone)).toContain(equipment.canonicalId);

    // Act — open the combat chain, stop at the Defend step, declare the
    // equipment as the block, then close the chain link.
    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(equipment);
    game.helpers.resolveRestOfCombat();

    // Assert — printed defense 1 reduced the damage: snatch 4 − ironrot 1 = 3.
    expect(Defender.life()).toBe(STARTING_LIFE - (SNATCH_POWER - 1));
    // Blade break at chain-link close: destroyed and gone from its slot …
    expect(Defender.zone(zone)).not.toContain(equipment.canonicalId);
    // … and routed to the graveyard.
    expect(Defender.zone("graveyard")).toContain(equipment.canonicalId);
  });

  it("boundary: once blade-broken it cannot defend a second attack link", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      defenderWith(zone, equipment),
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // Chain link 1 — block with the equipment; it blade-breaks to the GY.
    Attacker.attackWith(snatchRed);
    Defender.defendWith(equipment);
    game.helpers.resolveRestOfCombat();
    expect(Defender.zone("graveyard")).toContain(equipment.canonicalId);

    // Chain link 2 — a fresh attack opens a new Defend window.
    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    // The destroyed equipment is no longer in any defendable zone (it lives
    // in the graveyard now), so declaring it as a block is impossible.
    expect(() => Defender.defendWith(equipment)).toThrow();
  });
});

describe("blade-break — no defend, no destroy (conditional on blocking)", () => {
  it("equipment that is NOT used to defend survives the chain link", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: STARTING_LIFE, head: [ironrotHelm], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    // No defend declaration — the helm is never committed as a block.
    game.helpers.resolveRestOfCombat();

    // Full snatch damage lands (4); the helm is NOT blade-broken.
    expect(Defender.life()).toBe(STARTING_LIFE - SNATCH_POWER);
    expect(Defender.zone("head")).toContain(ironrotHelm.canonicalId);
    expect(Defender.zone("graveyard")).not.toContain(ironrotHelm.canonicalId);
  });
});
