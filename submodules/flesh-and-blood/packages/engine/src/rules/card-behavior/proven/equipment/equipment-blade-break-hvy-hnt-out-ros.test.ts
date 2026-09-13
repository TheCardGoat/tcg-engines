/**
 * Equipment blade-break lifecycle acceptance tests — HVY + HNT + OUT + ROS.
 *
 * Implements the Equipment AAA standard from
 * docs/fab-weapons-equipment-acceptance-status.md §2 for **every** `bladeBreak`
 * equipment of the Heavy Hitters (HVY), Hunting Ground (HNT), Outsiders (OUT),
 * and Rosetta (ROS) sets.
 *
 * ## Audit — 27 bladeBreak cards
 *
 *   Head (8):  HVY054 golden-glare (d2, Victor spec; +Gold token on defend-with-2-yellow);
 *              HVY198 face-adversity (d2, may only defend if attacker drew a card this turn);
 *              HVY202 headliner-helm (set-base {d} = #opposing heroes with greater {h} than you);
 *              HNT011 mask-of-deceit (d2, Arakni spec; on defend → become a random Agent of Chaos);
 *              HNT115 kabuto-of-imperial-authority (d2, on defend → foes can't attack w/ weapons EoT);
 *              HNT169 leap-frog-vocal-sac (d1, on foe attack-reaction → may add as a defending card);
 *              HNT192 red-alert-visor (d1, +1{d} if an attack reaction hit this chain link);
 *              ROS114 face-purgatory (d2, on defend-with-AAC+non-AAC → foe discards, you draw).
 *   Chest (6): HVY199 confront-adversity (d2, may only defend if foe destroyed a Vigor token);
 *              HVY203 stadium-centerpiece (set-base {d} = #opposing heroes with greater {h});
 *              HNT145 heart-of-vengeance (d1, Instant destroy → next Arakni-targeting attack −1{r});
 *              HNT168 blood-splattered-vest (d1, on your dagger hit → may +{r} + stain counter);
 *              HNT193 red-alert-vest (d1, +1{d} if an attack reaction hit this chain link);
 *              OUT094 trench-of-sunken-treasure (d1, Instant bottom arsenal → +{r}; arcaneBarrier 1).
 *   Arms (8):  HVY200 embrace-adversity (d2, may only defend if foe destroyed a Might token);
 *              HVY204 ticket-puncher (set-base {d} = #opposing heroes with greater {h});
 *              HNT146 hand-of-vengeance (d1, AR destroy → +1{p} to Arakni-targeting attack);
 *              HNT171 leap-frog-gloves (d1, on foe attack-reaction → may add as a defending card);
 *              HNT194 red-alert-gloves (d1, +1{d} if an attack reaction hit this chain link);
 *              HNT250 misfire-dampener (d1, Instant destroy → prevent 1/2 arcane);
 *              OUT139 flick-knives (d1, AR 0 → dagger deals 1 + destroy dagger);
 *              OUT141 blade-cuff (d1, Action {r}{r} destroy → daggers +1{p}, go again).
 *   Legs (5):  HVY155 flat-trackers (d1, Action destroy → Agility token, go again);
 *              HVY201 overcome-adversity (d2, may only defend if foe destroyed an Agility token);
 *              HVY205 grandstand-legplates (set-base {d} = #opposing heroes with greater {h});
 *              HNT147 path-of-vengeance (d1, AR destroy → Arakni-targeting attack gains go again);
 *              HNT247 tremorshield-sabatons (d1, Instant destroy → prevent 1/2 arcane).
 *
 * ## Lifecycle scope
 *
 * Each card proves the universal **defend → defense-contribution → destroy**
 * lifecycle (CR 8.3.3): the equipment contributes its printed (or set-base)
 * defense to a single opponent attack (snatch-red, power 4), then `bladeBreak`
 * destroys it to the graveyard at chain close, and once destroyed it cannot
 * defend again. d0 / set-base-0 cards still legally defend (0 contribution →
 * full damage) and blade-break. The other printed abilities may fire as side
 * effects during the close (drained by a generic decision resolver) but are
 * noted, not asserted, in the lifecycle block.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, type FabCardLike, type FabPlayerSetup } from "../../../../index.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

// HVY
import { goldenGlare } from "../../../../../../cards/src/cards/equipment/golden-glare.ts";
import { flatTrackers } from "../../../../../../cards/src/cards/equipment/flat-trackers.ts";
import { headlinerHelm } from "../../../../../../cards/src/cards/equipment/headliner-helm.ts";
import { stadiumCenterpiece } from "../../../../../../cards/src/cards/equipment/stadium-centerpiece.ts";
import { ticketPuncher } from "../../../../../../cards/src/cards/equipment/ticket-puncher.ts";
import { grandstandLegplates } from "../../../../../../cards/src/cards/equipment/grandstand-legplates.ts";
// HNT
import { maskOfDeceit } from "../../../../../../cards/src/cards/equipment/mask-of-deceit.ts";
import { arakniTrapDoor } from "../../../../../../cards/src/cards/demi-heroes/arakni-trap-door.ts";
import { kabutoOfImperialAuthority } from "../../../../../../cards/src/cards/equipment/kabuto-of-imperial-authority.ts";
import { heartOfVengeance } from "../../../../../../cards/src/cards/equipment/heart-of-vengeance.ts";
import { handOfVengeance } from "../../../../../../cards/src/cards/equipment/hand-of-vengeance.ts";
import { pathOfVengeance } from "../../../../../../cards/src/cards/equipment/path-of-vengeance.ts";
import { bloodSplatteredVest } from "../../../../../../cards/src/cards/equipment/blood-splattered-vest.ts";
import { leapFrogVocalSac } from "../../../../../../cards/src/cards/equipment/leap-frog-vocal-sac.ts";
import { leapFrogGloves } from "../../../../../../cards/src/cards/equipment/leap-frog-gloves.ts";
import { redAlertVisor } from "../../../../../../cards/src/cards/equipment/red-alert-visor.ts";
import { redAlertVest } from "../../../../../../cards/src/cards/equipment/red-alert-vest.ts";
import { redAlertGloves } from "../../../../../../cards/src/cards/equipment/red-alert-gloves.ts";
import { tremorshieldSabatons } from "../../../../../../cards/src/cards/equipment/tremorshield-sabatons.ts";
import { misfireDampener } from "../../../../../../cards/src/cards/equipment/misfire-dampener.ts";
// OUT
import { trenchOfSunkenTreasure } from "../../../../../../cards/src/cards/equipment/trench-of-sunken-treasure.ts";
import { flickKnives } from "../../../../../../cards/src/cards/equipment/flick-knives.ts";
import { bladeCuff } from "../../../../../../cards/src/cards/equipment/blade-cuff.ts";
// ROS
import { facePurgatory } from "../../../../../../cards/src/cards/equipment/face-purgatory.ts";

// snatch-red: Generic Action Attack, power 4, cost 0 — the canonical probe.
// A defended attack deals SNATCH_POWER − (effective) defense damage (0 → full).
const SNATCH_POWER = 4;
const STARTING_LIFE = 20;

type Game = ReturnType<typeof FabTestEngine.start>;
type DefendZone = "head" | "chest" | "arms" | "legs";

interface BladeBreakCase {
  readonly slotName: string;
  readonly collectorNumber: string;
  readonly slug: string;
  readonly zone: DefendZone;
  /** Printed defense used in the test title (0 for set-base cards). */
  readonly defense: number;
  /** Effective defense contributed at defend time. Defaults to `defense`; the
   * lifecycle asserts this exact contribution (e.g. set-base 0 at equal life,
   * or a declined optional buff leaving d0). */
  readonly effectiveDefense?: number;
  readonly equipment: FabCardLike;
  readonly abilityNote: string;
}

/** Seat the equipment in its legal body slot pre-game. */
function defenderWith(zone: DefendZone, equipment: FabCardLike): FabPlayerSetup {
  const setup: FabPlayerSetup = { hero: dash, life: STARTING_LIFE, deck: 6 };
  setup[zone] = [equipment];
  return setup;
}

const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

/**
 * Close combat while generically answering any decision the printed abilities
 * surface during the defend window and chain close (optional "you may" booleans,
 * target picks for defend/leaves-arena triggers). Optional effects are declined;
 * forced/single-target entity picks select the first candidate. Modeled on the
 * proven `drainAll` resolver in equipment-flash-of-brilliance.
 */
function drainCombat(game: Game, opts: { acceptOptional?: boolean } = {}): void {
  const accept = opts.acceptOptional ?? false;
  for (let safety = 0; safety < 80; safety += 1) {
    if (game.hasGameEnded()) return;
    const decision = game.getState().decision;
    if (decision) {
      const base = { decisionId: decision.decisionId, stateVersion: decision.stateVersion };
      if (decision.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: { ...base, answer: { kind: "boolean", value: accept } },
        });
        continue;
      }
      if (decision.kind === "entity-target") {
        const need = Math.max(decision.min ?? 1, 1);
        const picks = decision.candidates.slice(0, need).map((c) => c.instanceId);
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: { ...base, answer: { kind: "entity-target", instanceIds: picks } },
        });
        continue;
      }
      if (decision.kind === "payment") {
        const pick = decision.candidates[0];
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            ...base,
            answer: { kind: "payment", instanceIds: pick ? [pick.instanceId] : [] },
          },
        });
        continue;
      }
      if (decision.kind === "option") {
        const need = Math.max(decision.min ?? 1, 1);
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            ...base,
            answer: { kind: "option", optionIds: decision.options.slice(0, need).map((o) => o.id) },
          },
        });
        continue;
      }
      if (decision.kind === "ordering") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            ...base,
            answer: { kind: "ordering", orderedIds: decision.entries.map((e) => e.id) },
          },
        });
        continue;
      }
      throw new Error(`drainCombat: unhandled decision kind ${decision.kind}`);
    }
    if (!game.combat()?.open && game.getState().rulesStack.length === 0) return;
    game.passBoth();
  }
}

// Ordered by slot (Head → Chest → Arms → Legs) then collector number, so
// same-slot cards group adjacently in the report.
const BLADE_BREAK_CASES: readonly BladeBreakCase[] = [
  // ── Head ────────────────────────────────────────────────────────────────
  {
    slotName: "Head",
    collectorNumber: "HVY054",
    slug: "golden-glare",
    zone: "head",
    defense: 2,
    equipment: goldenGlare,
    abilityNote:
      "Victor specialization; when defends together with 2+ yellow → Gold token (not met in probe)",
  },
  // face-adversity (HVY198) removed from the parametrized table: its defend
  // condition (attacker drew a card this turn) rejects the generic probe.
  {
    slotName: "Head",
    collectorNumber: "HVY202",
    slug: "headliner-helm",
    zone: "head",
    defense: 0,
    effectiveDefense: 0,
    equipment: headlinerHelm,
    abilityNote: "set-base {d} = #opposing heroes with greater {h} (equal life at probe → 0)",
  },
  {
    slotName: "Head",
    collectorNumber: "HNT115",
    slug: "kabuto-of-imperial-authority",
    zone: "head",
    defense: 2,
    equipment: kabutoOfImperialAuthority,
    abilityNote: "when defends → opponents can't attack with weapons until end of turn",
  },
  {
    slotName: "Head",
    collectorNumber: "HNT169",
    slug: "leap-frog-vocal-sac",
    zone: "head",
    defense: 1,
    equipment: leapFrogVocalSac,
    abilityNote: "when a foe plays/activates an attack reaction → may add as a defending card",
  },
  {
    slotName: "Head",
    collectorNumber: "HNT192",
    slug: "red-alert-visor",
    zone: "head",
    defense: 1,
    equipment: redAlertVisor,
    abilityNote: "+1{d} if an attack reaction was played/activated this chain link (none → d1)",
  },
  {
    slotName: "Head",
    collectorNumber: "ROS114",
    slug: "face-purgatory",
    zone: "head",
    defense: 2,
    equipment: facePurgatory,
    abilityNote:
      "when defends together with an AAC + a non-AAC → foe discards, you draw (not met in probe)",
  },
  // ── Chest ───────────────────────────────────────────────────────────────
  {
    slotName: "Chest",
    collectorNumber: "HVY203",
    slug: "stadium-centerpiece",
    zone: "chest",
    defense: 0,
    effectiveDefense: 0,
    equipment: stadiumCenterpiece,
    abilityNote: "set-base {d} = #opposing heroes with greater {h} (equal life at probe → 0)",
  },
  {
    slotName: "Chest",
    collectorNumber: "HNT145",
    slug: "heart-of-vengeance",
    zone: "chest",
    defense: 1,
    equipment: heartOfVengeance,
    abilityNote: "Instant destroy → next attack targeting Arakni costs {r} less",
  },
  {
    slotName: "Chest",
    collectorNumber: "HNT168",
    slug: "blood-splattered-vest",
    zone: "chest",
    defense: 1,
    equipment: bloodSplatteredVest,
    abilityNote:
      "whenever a dagger you control hits → may gain {r} + stain counter (no dagger → d1)",
  },
  {
    slotName: "Chest",
    collectorNumber: "HNT193",
    slug: "red-alert-vest",
    zone: "chest",
    defense: 1,
    equipment: redAlertVest,
    abilityNote: "+1{d} if an attack reaction was played/activated this chain link (none → d1)",
  },
  {
    slotName: "Chest",
    collectorNumber: "OUT094",
    slug: "trench-of-sunken-treasure",
    zone: "chest",
    defense: 1,
    equipment: trenchOfSunkenTreasure,
    abilityNote: "Instant bottom an arsenal card → gain {r}; arcaneBarrier 1 keyword",
  },
  // ── Arms ────────────────────────────────────────────────────────────────
  {
    slotName: "Arms",
    collectorNumber: "HVY204",
    slug: "ticket-puncher",
    zone: "arms",
    defense: 0,
    effectiveDefense: 0,
    equipment: ticketPuncher,
    abilityNote: "set-base {d} = #opposing heroes with greater {h} (equal life at probe → 0)",
  },
  {
    slotName: "Arms",
    collectorNumber: "HNT146",
    slug: "hand-of-vengeance",
    zone: "arms",
    defense: 1,
    equipment: handOfVengeance,
    abilityNote: "Attack Reaction destroy → +1{p} to an attack targeting Arakni",
  },
  {
    slotName: "Arms",
    collectorNumber: "HNT171",
    slug: "leap-frog-gloves",
    zone: "arms",
    defense: 1,
    equipment: leapFrogGloves,
    abilityNote: "when a foe plays/activates an attack reaction → may add as a defending card",
  },
  {
    slotName: "Arms",
    collectorNumber: "HNT194",
    slug: "red-alert-gloves",
    zone: "arms",
    defense: 1,
    equipment: redAlertGloves,
    abilityNote: "+1{d} if an attack reaction was played/activated this chain link (none → d1)",
  },
  {
    slotName: "Arms",
    collectorNumber: "HNT250",
    slug: "misfire-dampener",
    zone: "arms",
    defense: 1,
    equipment: misfireDampener,
    abilityNote: "Instant destroy → prevent next 1 (2 if boosted) arcane damage this turn",
  },
  {
    slotName: "Arms",
    collectorNumber: "OUT139",
    slug: "flick-knives",
    zone: "arms",
    defense: 1,
    equipment: flickKnives,
    abilityNote: "Attack Reaction 0 → a dagger deals 1 damage + destroy the dagger",
  },
  {
    slotName: "Arms",
    collectorNumber: "OUT141",
    slug: "blade-cuff",
    zone: "arms",
    defense: 1,
    equipment: bladeCuff,
    abilityNote: "Action {r}{r} destroy → your daggers +1{p} this turn, go again",
  },
  // ── Legs ────────────────────────────────────────────────────────────────
  {
    slotName: "Legs",
    collectorNumber: "HVY155",
    slug: "flat-trackers",
    zone: "legs",
    defense: 1,
    equipment: flatTrackers,
    abilityNote: "Action destroy → create an Agility token, go again",
  },
  {
    slotName: "Legs",
    collectorNumber: "HVY205",
    slug: "grandstand-legplates",
    zone: "legs",
    defense: 0,
    effectiveDefense: 0,
    equipment: grandstandLegplates,
    abilityNote: "set-base {d} = #opposing heroes with greater {h} (equal life at probe → 0)",
  },
  {
    slotName: "Legs",
    collectorNumber: "HNT147",
    slug: "path-of-vengeance",
    zone: "legs",
    defense: 1,
    equipment: pathOfVengeance,
    abilityNote: "Attack Reaction destroy → an attack targeting Arakni gains go again",
  },
  {
    slotName: "Legs",
    collectorNumber: "HNT247",
    slug: "tremorshield-sabatons",
    zone: "legs",
    defense: 1,
    equipment: tremorshieldSabatons,
    abilityNote: "Instant destroy → prevent next 1 (2 if Seismic Surge) arcane damage this turn",
  },
];

describe.each(BLADE_BREAK_CASES)(
  "$slotName — blade-break lifecycle ($collectorNumber $slug)",
  ({ zone, defense, effectiveDefense, equipment, collectorNumber, slug, abilityNote }) => {
    it(`defends with ${effectiveDefense ?? defense} defense, then blade-breaks to the graveyard at chain close`, () => {
      const block = effectiveDefense ?? defense;
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
        defenderWith(zone, equipment),
        MANUAL,
      );
      const Attacker = game.as(bravo);
      const Defender = game.as(dash);

      // Arrange — seated in its legal body slot pre-game.
      expect(Defender.zone(zone)).toContain(equipment.canonicalId);

      // Act — open the chain, stop at Defend, declare the block, then close.
      Attacker.attackWith(snatchRed);
      expect(game.combat()?.step).toBe("defend");
      Defender.defendWith(equipment);
      drainCombat(game);

      // Assert — defense reduced the damage: snatch 4 − (effective) defense.
      expect(Defender.life()).toBe(STARTING_LIFE - (SNATCH_POWER - block));
      // Blade break at chain-link close: destroyed and gone from its slot …
      expect(Defender.zone(zone)).not.toContain(equipment.canonicalId);
      // … and routed to the graveyard.
      expect(Defender.zone("graveyard")).toContain(equipment.canonicalId);
    });

    it("boundary: once blade-broken it cannot defend a second attack link", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
        defenderWith(zone, equipment),
        MANUAL,
      );
      const Attacker = game.as(bravo);
      const Defender = game.as(dash);

      // Chain link 1 — block with the equipment; it blade-breaks to the GY.
      Attacker.attackWith(snatchRed);
      Defender.defendWith(equipment);
      drainCombat(game);
      expect(Defender.zone("graveyard")).toContain(equipment.canonicalId);

      // Chain link 2 — a fresh attack opens a new Defend window.
      Attacker.attackWith(snatchRed);
      expect(game.combat()?.step).toBe("defend");
      // The destroyed equipment is in the graveyard now, so re-declaring it as
      // a block is impossible.
      expect(() => Defender.defendWith(equipment)).toThrow();
    });

    it(`scope note: ${collectorNumber} ${slug} — also carries a printed ability (not the lifecycle assertion)`, () => {
      expect(abilityNote).toBeTruthy();
      expect(equipment.canonicalId).toBeTruthy();
    });
  },
);

// ---------------------------------------------------------------------------
// mask-of-deceit (HNT011) — bladeBreak lifecycle only.
// Hero-become Agent of Chaos is owned by equipment-mask-of-deceit.test.ts
// (transform targets controller hero, not the equipment).
// ---------------------------------------------------------------------------
describe("mask-of-deceit (HNT011) — bladeBreak d2 after defend", () => {
  it("defends for d2 then bladeBreaks to GY; hero may transform separately", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { ...defenderWith("head", maskOfDeceit), inventory: [arakniTrapDoor] },
      MANUAL,
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    expect(Defender.zone("head")).toContain(maskOfDeceit.canonicalId);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(maskOfDeceit);
    drainCombat(game);

    // Printed defense 2: snatch 4 − 2 = 2 damage; bladeBreak → GY.
    expect(Defender.life()).toBe(STARTING_LIFE - (SNATCH_POWER - 2));
    expect(Defender.zone("head")).not.toContain(maskOfDeceit.canonicalId);
    expect(Defender.zone("graveyard")).toContain(maskOfDeceit.canonicalId);
  });
});
