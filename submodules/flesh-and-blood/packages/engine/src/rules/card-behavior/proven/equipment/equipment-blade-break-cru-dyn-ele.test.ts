/**
 * Equipment blade-break lifecycle acceptance tests — CRU + DYN + ELE.
 *
 * Implements the Equipment AAA standard from
 * docs/fab-weapons-equipment-acceptance-status.md §2 for **every** `bladeBreak`
 * equipment of the Crucible of War (CRU), Dynasty (DYN), and Tales of Aria
 * (ELE) sets.
 *
 * ## Audit
 *
 * An audit of all equipment files under
 * `packages/cards/src/cards/{CRU,DYN,ELE}/equipments/` found exactly **eight**
 * cards carrying the `bladeBreak` keyword. Seven of them ALSO carry a printed
 * ability; one — rotten-old-buckler — is genuinely stat-only (defense +
 * `bladeBreak`, no printed ability):
 *
 *   - Head:    amethyst-tiara     (DYN171) — defense 1; activated Instant (Runechants gain Spellvoid 1)
 *   - Head:    new-horizon        (ELE213) — defense 2; static extra arsenal zone + "when destroyed, destroy arsenal"
 *   - Chest:   blazen-yoroi       (DYN045) — defense 1; static +4 defense on chain link 4+
 *   - Chest:   heart-of-ice       (ELE144) — defense 1; activated Action cost-curve + Arcane Barrier 1
 *   - Arms:    hornet-s-sting     (DYN152) — defense 1; triggered "whenever defends" reveal-top-of-deck
 *   - Legs:    perch-grapplers    (CRU122) — defense 2; activated Action (arsenal arrows gain go again)
 *   - Legs:    spellbound-creepers(ELE224) — defense 1; activated Instant + end-phase destroy trigger
 *   - Off-Hand: rotten-old-buckler(ELE204) — defense 1; STAT-ONLY (no printed ability)
 *
 * ## Scope note — the probe is an opponent's physical attack
 *
 * This file tests ONLY the universal **defend → defense-contribution → destroy**
 * lifecycle (CR 8.3.3) that the `bladeBreak` keyword guarantees for every card
 * that carries it, independent of any other printed ability. The probe attack
 * is an *opponent's* physical attack (snatch-red, power 4), so none of the
 * controller-facing abilities can fire during the defend window of a single
 * chain link — the controller resource/cost paths, start-of-turn and end-phase
 * triggers, and controller attack abilities are all out of reach. The other
 * printed abilities are exercised by their own AAAs and are intentionally NOT
 * driven here.
 *
 * Each card proves: (1) seated pre-game in its legal slot, (2) its printed
 * defense reduces the incoming damage, (3) it blade-breaks to the graveyard at
 * chain close, (4) once destroyed it cannot defend again.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, type FabCardLike, type FabPlayerSetup } from "../../../../index.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { perchGrapplers } from "../../../../../../cards/src/cards/equipment/perch-grapplers.ts";
import { blazenYoroi } from "../../../../../../cards/src/cards/equipment/blazen-yoroi.ts";
import { hornetSSting } from "../../../../../../cards/src/cards/equipment/hornet-s-sting.ts";
import { amethystTiara } from "../../../../../../cards/src/cards/equipment/amethyst-tiara.ts";
import { heartOfIce } from "../../../../../../cards/src/cards/equipment/heart-of-ice.ts";
import { rottenOldBuckler } from "../../../../../../cards/src/cards/equipment/rotten-old-buckler.ts";
import { newHorizon } from "../../../../../../cards/src/cards/equipment/new-horizon.ts";
import { spellboundCreepers } from "../../../../../../cards/src/cards/equipment/spellbound-creepers.ts";
// snatch-red: Generic Action Attack, power 4, cost 0 — the canonical probe
// attack used across the keyword suite (e.g. 08-keywords.test.ts). A defended
// attack deals SNATCH_POWER − equipment.defense damage.
const SNATCH_POWER = 4;
const STARTING_LIFE = 20;

// Body slots plus the second weapon zone, which holds Off-Hand equipment
// (e.g. rotten-old-buckler). `defendWith` resolves Off-Hand from `weapon2`.
type DefendZone = "head" | "chest" | "arms" | "legs" | "weapon2";

interface BladeBreakCase {
  /** Printed equipment slot, for grouping. */
  readonly slotName: string;
  readonly collectorNumber: string;
  readonly slug: string;
  /** Defendable zone matching the printed slot. */
  readonly zone: DefendZone;
  /** Printed defense — the block contribution asserted after the chain closes. */
  readonly defense: number;
  readonly equipment: FabCardLike;
  /** `true` for defense + bladeBreak with no printed ability text. */
  readonly statOnly: boolean;
  /** Short note on the OTHER printed ability (empty when stat-only). */
  readonly abilityNote: string;
}

/** Seat the equipment in its legal body slot pre-game. */
function defenderWith(zone: DefendZone, equipment: FabCardLike): FabPlayerSetup {
  const setup: FabPlayerSetup = { hero: dash, life: STARTING_LIFE, deck: 6 };
  setup[zone] = [equipment];
  return setup;
}

// Ordered by slot: Head → Chest → Arms → Legs → Off-Hand, so same-slot cards
// group adjacently in the report.
const BLADE_BREAK_CASES: readonly BladeBreakCase[] = [
  {
    slotName: "Head",
    collectorNumber: "DYN171",
    slug: "amethyst-tiara",
    zone: "head",
    defense: 1,
    equipment: amethystTiara,
    statOnly: false,
    abilityNote:
      "activated Instant — destroy self: Runechants gain Spellvoid 1 (controller resource/arcane path; never blocks an opponent attack)",
  },
  {
    slotName: "Head",
    collectorNumber: "ELE213",
    slug: "new-horizon",
    zone: "head",
    defense: 2,
    equipment: newHorizon,
    statOnly: false,
    abilityNote:
      "static extra arsenal zone + 'when destroyed, destroy all arsenal cards' (no arsenal seeded → destroy trigger is a no-op)",
  },
  {
    slotName: "Chest",
    collectorNumber: "DYN045",
    slug: "blazen-yoroi",
    zone: "chest",
    defense: 1,
    equipment: blazenYoroi,
    statOnly: false,
    abilityNote:
      "static +4 defense on chain link 4+ (single probe link is link 1, so the buff does not apply)",
  },
  {
    slotName: "Chest",
    collectorNumber: "ELE144",
    slug: "heart-of-ice",
    zone: "chest",
    defense: 1,
    equipment: heartOfIce,
    statOnly: false,
    abilityNote:
      "activated Action cost-curve + Arcane Barrier 1 (resource/arcane paths; never blocks an opponent attack)",
  },
  {
    slotName: "Arms",
    collectorNumber: "DYN152",
    slug: "hornet-s-sting",
    zone: "arms",
    defense: 1,
    equipment: hornetSSting,
    statOnly: false,
    abilityNote:
      "triggered 'whenever defends' reveal-top-of-deck (filler deck → no arrow → bottom; does not change probe damage)",
  },
  {
    slotName: "Legs",
    collectorNumber: "CRU122",
    slug: "perch-grapplers",
    zone: "legs",
    defense: 2,
    equipment: perchGrapplers,
    statOnly: false,
    abilityNote:
      "activated Action — arsenal arrows gain go again (controller attack path; never fires on defense)",
  },
  {
    slotName: "Legs",
    collectorNumber: "ELE224",
    slug: "spellbound-creepers",
    zone: "legs",
    defense: 1,
    equipment: spellboundCreepers,
    statOnly: false,
    abilityNote:
      "activated Instant + end-phase destroy trigger (controller paths; never fire on defense)",
  },
  {
    slotName: "Off-Hand",
    collectorNumber: "ELE204",
    slug: "rotten-old-buckler",
    zone: "weapon2",
    defense: 1,
    equipment: rottenOldBuckler,
    statOnly: true,
    abilityNote: "",
  },
];

describe.each(BLADE_BREAK_CASES)(
  "$slotName — blade-break lifecycle ($collectorNumber $slug)",
  ({ zone, defense, equipment, slug, collectorNumber, statOnly, abilityNote }) => {
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
      // ability does not alter an opponent's single-link attack damage.
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

    // Documents the deliberate scope boundary: a stat-only card has no other
    // ability; an ability-bearing card's other text exists but is intentionally
    // NOT driven by the blade-break probe.
    it(`scope note: ${collectorNumber} ${slug} — ${statOnly ? "stat-only (no printed ability)" : "also carries a printed ability (not exercised here)"}`, () => {
      expect(equipment.canonicalId).toBeTruthy();
      if (statOnly) {
        expect(abilityNote).toBe("");
      } else {
        expect(abilityNote).toBeTruthy();
      }
    });
  },
);
