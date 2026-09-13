import {
  beamingBravadoBlue,
  beamingBravadoRed,
} from "@tcg/flesh-and-blood-cards/cards/actions/beaming-bravado";
import {
  battlefieldBlitzBlue,
  battlefieldBlitzRed,
} from "@tcg/flesh-and-blood-cards/cards/actions/battlefield-blitz";
import { spiritOfEirinaYellow } from "@tcg/flesh-and-blood-cards/cards/actions/spirit-of-eirina";
import {
  beamingBravadoYellow,
  battlefieldBlitzYellow,
  battlefieldBeaconYellow,
  boltOfCourageRed,
  cintariSaber,
  courageOfBladehold,
  courageousSteelhandRed,
  engulfingLightRed,
  engulfingLightYellow,
  expressLightningYellow,
  illuminateYellow,
  luminaAscensionYellow,
  serBoltynBreakerOfDawn,
  snapdragonScalers,
  takeFlightYellow,
} from "@tcg/flesh-and-blood-cards/simulator-scenario-cards";
import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";

import { catalogIds, realCardDefinition } from "./cards";
import { createEngine, matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

const COMBO_CARDS = [
  beamingBravadoYellow,
  battlefieldBlitzYellow,
  battlefieldBeaconYellow,
  boltOfCourageRed,
  cintariSaber,
  courageOfBladehold,
  courageousSteelhandRed,
  engulfingLightRed,
  engulfingLightYellow,
  expressLightningYellow,
  illuminateYellow,
  luminaAscensionYellow,
  serBoltynBreakerOfDawn,
  snapdragonScalers,
  takeFlightYellow,
] as const;

const STARTING_SOUL = [
  beamingBravadoRed,
  beamingBravadoBlue,
  battlefieldBlitzRed,
  battlefieldBlitzBlue,
] as const;

/**
 * A beginning-of-turn, maximum-pressure Sabers Boltyn line. Four cards are
 * already in soul from prior turns, and Spirit of Eirina is already in the
 * arena so each Lumina Ascension can be played as though it were an instant:
 *
 * 1. Engulfing Light charges Bolt of Courage; Snapdragon gives it go again.
 * 2. Courage of Bladehold makes every Saber activation free this turn.
 * 3. Three Lumina Ascensions grant four attacks with each Cintari Saber.
 * 4. Each unblocked Saber hit resolves three Lumina hit triggers.
 *
 * The remaining deck is a legal-copy-count mix of real Light cards. Eight
 * Saber hits therefore put 24 cards into soul, in addition to the charge and
 * Engulfing Light itself. Boltyn can spend seven soul cards to keep go again
 * through the first seven Saber attacks.
 */
function bootBoltynSabersCombo(): FabPracticeMatch {
  const deck = [
    boltOfCourageRed,
    boltOfCourageRed,
    engulfingLightYellow,
    ...Array.from({ length: 3 }, () => beamingBravadoYellow),
    ...Array.from({ length: 3 }, () => battlefieldBlitzYellow),
    ...Array.from({ length: 3 }, () => battlefieldBeaconYellow),
    ...Array.from({ length: 3 }, () => courageousSteelhandRed),
    ...Array.from({ length: 3 }, () => expressLightningYellow),
    ...Array.from({ length: 3 }, () => illuminateYellow),
    ...Array.from({ length: 3 }, () => takeFlightYellow),
  ].map((card) => card.canonicalId);

  const engine = createEngine({
    seed: "fab-scenario-boltyn-sabers-combo",
    cardDefinitions: Object.fromEntries([
      ...COMBO_CARDS.map(
        (card) => [card.canonicalId, realCardDefinition(card.canonicalId)] as const,
      ),
      ...STARTING_SOUL.map((card) => [card.canonicalId, card] as const),
      [spiritOfEirinaYellow.canonicalId, spiritOfEirinaYellow] as const,
    ]),
    player1: {
      heroCardId: serBoltynBreakerOfDawn.canonicalId,
      life: 40,
      hand: [
        engulfingLightRed.canonicalId,
        boltOfCourageRed.canonicalId,
        luminaAscensionYellow.canonicalId,
        luminaAscensionYellow.canonicalId,
      ],
      arsenal: [luminaAscensionYellow.canonicalId],
      chest: [courageOfBladehold.canonicalId],
      legs: [snapdragonScalers.canonicalId],
      weapon1: [cintariSaber.canonicalId],
      weapon2: [cintariSaber.canonicalId],
      arena: [spiritOfEirinaYellow.canonicalId],
      deck,
      soul: STARTING_SOUL.map((card) => card.canonicalId),
      actionPoints: 1,
      resourcePoints: 0,
    },
    player2: {
      heroCardId: catalogIds.bravo,
      // Keep the practice target alive through the eighth Saber hit so the
      // final three Lumina triggers remain visible and testable.
      life: 100,
      hand: [],
      deck: 24,
    },
  });

  return matchFromEngine(engine, "fab-scenario-boltyn-sabers-combo");
}

export const BOLTYN_COMBO_SCENARIOS = {
  "boltyn-sabers-combo": {
    id: "boltyn-sabers-combo",
    label: "Sabers Boltyn — triple Lumina combo turn",
    description:
      "Begin with four cards in soul and Spirit of Eirina in the arena: charge with Engulfing Light, use Snapdragon and Courage, play three Lumina Ascensions as instants, then attack eight times with Cintari Sabers.",
    group: "hero-special",
    tags: ["boltyn", "cintari-saber", "lumina-ascension", "combo", "soul", "hero-signals"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot: bootBoltynSabersCombo,
  },
} as const satisfies FabScenarioCollection;
