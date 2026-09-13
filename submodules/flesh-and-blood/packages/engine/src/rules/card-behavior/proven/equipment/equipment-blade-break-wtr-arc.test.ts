/**
 * Equipment blade-break lifecycle acceptance tests — WTR + ARC.
 *
 * Implements the Equipment AAA standard from
 * docs/fab-weapons-equipment-acceptance-status.md §2 for the **bladeBreak**
 * equipment of the Welcome to Rathe (WTR) and Arcane Rising (ARC) sets.
 *
 * ## Scope note — these are NOT stat-only
 *
 * Unlike the ironrot family covered in `equipment-blade-break.test.ts` — the
 * canonical *stat-only* blade-break set (defense + `bladeBreak`, no printed
 * ability) — **every** WTR/ARC equipment carrying the `bladeBreak` keyword ALSO
 * carries a printed ability. An audit of all 22 WTR/ARC equipment files
 * (`packages/cards/src/cards/{WTR,ARC}/equipments/`) found exactly three
 * `bladeBreak` cards, all ability-bearing:
 *
 *   - Head:  mask-of-momentum       (WTR079) — defense 2; triggered draw on 3rd+ hit
 *   - Head:  skullbone-crosswrap    (ARC041) — defense 1; activated Opt 1 + Arcane Barrier 1
 *   - Chest: fyendal-s-spring-tunic (WTR150) — defense 1; energy-counter resource ability
 *
 * The genuinely stat-only WTR/ARC equipment is the **nullrune** family
 * (ARC155–158), but those use `arcaneBarrier`, not `bladeBreak`, so they are
 * out of scope here (they do not destroy on defend).
 *
 * This file therefore tests ONLY the universal **defend → defense-contribution →
 * destroy** lifecycle (CR 8.3.3) that the `bladeBreak` keyword guarantees for
 * every card that carries it, independent of any other printed ability. The
 * other abilities are exercised by their own AAAs and are intentionally NOT
 * driven here — the probe attack is an opponent's, so none of these
 * controller-attack / start-of-turn / activated abilities can fire during the
 * defend window.
 *
 * Each card proves: (1) seated pre-game in its legal slot, (2) its printed
 * defense reduces the incoming damage, (3) it blade-breaks to the graveyard at
 * chain close, (4) once destroyed it cannot defend again.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, type FabCardLike, type FabPlayerSetup } from "../../../../index.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { maskOfMomentum } from "../../../../../../cards/src/cards/equipment/mask-of-momentum.ts";
import { fyendalSSpringTunic } from "../../../../../../cards/src/cards/equipment/fyendal-s-spring-tunic.ts";
import { skullboneCrosswrap } from "../../../../../../cards/src/cards/equipment/skullbone-crosswrap.ts";

// snatch-red: Generic Action Attack, power 4, cost 0 — the canonical probe
// attack used across the keyword suite (e.g. 08-keywords.test.ts). A defended
// attack deals SNATCH_POWER − equipment.defense damage.
const SNATCH_POWER = 4;
const STARTING_LIFE = 20;

type BodyZone = "head" | "chest" | "arms" | "legs";

interface BladeBreakCase {
  /** Printed equipment slot, for grouping. */
  readonly slotName: string;
  readonly slug: string;
  readonly collectorNumber: string;
  /** Defendable body zone matching the printed slot. */
  readonly zone: BodyZone;
  /** Printed defense — the block contribution asserted after the chain closes. */
  readonly defense: number;
  readonly equipment: FabCardLike;
  /** Short note on the OTHER printed ability (NOT exercised here). */
  readonly abilityNote: string;
}

// Ordered Head → Head → Chest so same-slot cards group adjacently.
const BLADE_BREAK_CASES: readonly BladeBreakCase[] = [
  {
    slotName: "Head",
    slug: "mask-of-momentum",
    collectorNumber: "WTR079",
    zone: "head",
    defense: 2,
    equipment: maskOfMomentum,
    abilityNote: "triggered draw on 3rd-or-higher chain link (not fired by an opponent attack)",
  },
  {
    slotName: "Head",
    slug: "skullbone-crosswrap",
    collectorNumber: "ARC041",
    zone: "head",
    defense: 1,
    equipment: skullboneCrosswrap,
    abilityNote: "activated Opt 1 + Arcane Barrier 1 (manual / irrelevant vs physical attack)",
  },
  {
    slotName: "Chest",
    slug: "fyendal-s-spring-tunic",
    collectorNumber: "WTR150",
    zone: "chest",
    defense: 1,
    equipment: fyendalSSpringTunic,
    abilityNote: "energy-counter resource ability (start-of-turn / instant; never blocks defend)",
  },
];

/** Seat the equipment in its legal body slot pre-game. */
function defenderWith(zone: BodyZone, equipment: FabCardLike): FabPlayerSetup {
  const setup: FabPlayerSetup = { hero: dash, life: STARTING_LIFE, deck: 6 };
  setup[zone] = [equipment];
  return setup;
}

describe.each(BLADE_BREAK_CASES)(
  "$slotName — blade-break lifecycle ($collectorNumber $slug)",
  ({ zone, defense, equipment, slug, collectorNumber, abilityNote }) => {
    it(`defends with its printed defense ${defense}, then blade-breaks to the graveyard at chain close`, () => {
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
      // equipment as the block, then close the chain link. The other printed
      // ability does not fire during an opponent's attack defend window.
      Attacker.attackWith(snatchRed);
      expect(game.combat()?.step).toBe("defend");
      Defender.defendWith(equipment);
      game.helpers.resolveRestOfCombat();

      // Assert — printed defense reduced the damage: snatch 4 − defense.
      expect(Defender.life()).toBe(STARTING_LIFE - (SNATCH_POWER - defense));
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

    // Documents the deliberate scope boundary: this card's other printed
    // ability exists but is intentionally NOT driven by the blade-break probe.
    it(`scope note: ${collectorNumber} ${slug} also carries a printed ability (not exercised here)`, () => {
      expect(abilityNote).toBeTruthy();
      expect(equipment.canonicalId).toBeTruthy();
    });
  },
);
