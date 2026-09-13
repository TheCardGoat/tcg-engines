/**
 * Single source of truth for hero-bound strategies.
 *
 * In Flesh and Blood, a hero-specific strategy is meaningful only when seated
 * with that hero (and that hero's card pool). Each binding pairs a hero
 * identity matcher ({@link FabHeroMatcher}) with the strategy that compiles
 * its guide lines. The public strategy registry derives its hero entries from
 * this table, and the `hero-profile` dispatcher iterates it in order — so the
 * "which heroes have a profile" question has exactly one answer, here.
 *
 * This is a FAB-local concept; other games model their automated seats
 * differently and should not share this abstraction.
 */
import type { FabBotStrategy } from "../../bot-strategies.ts";
import { arakniStrategy } from "./arakni.ts";
import { auroraStrategy } from "./aurora.ts";
import { gravyStrategy } from "./gravy.ts";
import { kayoStrategy } from "./kayo.ts";
import { lyathStrategy } from "./lyath.ts";
import { maliceStrategy } from "./malice.ts";
import { marlynnStrategy } from "./marlynn.ts";
import { oscilioStrategy } from "./oscilio.ts";
import { pleiadesStrategy } from "./pleiades.ts";
import { puffinStrategy } from "./puffin.ts";
import { rhinarStrategy } from "./rhinar.ts";
import { teklovossenStrategy } from "./teklovossen.ts";
import { tuffnutStrategy } from "./tuffnut.ts";
import { valdaStrategy } from "./valda.ts";
import { viseraiForsakenStrategy } from "./viserai-the-forsaken.ts";
import { zyggyStrategy } from "./zyggy.ts";
import {
  isArakniHero,
  isAuroraHero,
  isGravyHero,
  isKayoHero,
  isLyathHero,
  isMaliceHero,
  isMarlynnHero,
  isOscilioHero,
  isPleiadesHero,
  isPuffinHero,
  isRhinarHero,
  isTeklovossenHero,
  isTuffnutHero,
  isValdaHero,
  isViseraiForsakenHero,
  isZyggyHero,
} from "./names.ts";

/** The identity a hero-bound strategy matches against — the seated hero card. */
export interface FabHeroIdentity {
  readonly heroName: string;
  readonly heroCanonicalId: string | null;
}

/** Predicate recognizing the hero a strategy is bound to. */
export type FabHeroMatcher = (hero: FabHeroIdentity) => boolean;

export interface FabHeroProfileBinding {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly strategy: FabBotStrategy;
  readonly heroMatch: FabHeroMatcher;
}

/**
 * Ordered hero↔strategy bindings. Order is the `hero-profile` dispatch
 * precedence (first matcher wins); keep it stable.
 */
export const FAB_HERO_PROFILE_BINDINGS: readonly FabHeroProfileBinding[] = [
  {
    id: "tuffnut",
    label: "Tuffnut",
    description:
      "Tuffnut: pitch the top card early on own turns to fund attacks; on defense only do so to fund a paid defensive line.",
    strategy: tuffnutStrategy,
    heroMatch: isTuffnutHero,
  },
  {
    id: "rhinar",
    label: "Rhinar",
    description:
      "Masterclass Rhinar: arsenal Bloodrush when the hand cannot convert, explode when 6-power fuel is live, defend the in-between turns.",
    strategy: rhinarStrategy,
    heroMatch: isRhinarHero,
  },
  {
    id: "teklovossen",
    label: "Teklovossen",
    description:
      "Masterclass Teklo: boost to banish Evos, play Evos from banished not hand, arsenal Fabricate, turn the corner with Tank/War Machine/Singularity.",
    strategy: teklovossenStrategy,
    heroMatch: isTeklovossenHero,
  },
  {
    id: "arakni",
    label: "Arakni",
    description:
      "Masterclass Arakni: mark then convert daggers and stealth finishers; keep Toxin in arsenal; don't flick the last Klaive early.",
    strategy: arakniStrategy,
    heroMatch: isArakniHero,
  },
  {
    id: "valda",
    label: "Valda",
    description:
      "Masterclass Valda: Ley Line first, dominate crush haymakers off Seismic Surges, arsenal Eruption, leave room to heave, spend the fridge on on-hits.",
    strategy: valdaStrategy,
    heroMatch: isValdaHero,
  },
  {
    id: "aurora",
    label: "Aurora",
    description:
      "Zero to Eighty Aurora: chain Lightning go-again, convert quickstrike off Embodiment, Gone in a Flash with an instant, finish leftover AP on Scorpio.",
    strategy: auroraStrategy,
    heroMatch: isAuroraHero,
  },
  {
    id: "oscilio",
    label: "Oscilio",
    description:
      "Zero to Eighty Oscilio: make Lightning Flows, arsenal Gone in a Flash while Greaves is live, then empty the arsenal for Ponder.",
    strategy: oscilioStrategy,
    heroMatch: isOscilioHero,
  },
  {
    id: "zyggy",
    label: "Zyggy",
    description:
      "Zero to Eighty Zyggy: play a ward aura, swing Reality Refractor, and send Phantasmaclasm as the two-card haymaker.",
    strategy: zyggyStrategy,
    heroMatch: isZyggyHero,
  },
  {
    id: "gravy",
    label: "Gravy Bones",
    description:
      "Zero to Eighty Gravy: enable Watery Grave with a blue, replay GY allies, chain go-again Pirates, and do not over-block the crew.",
    strategy: gravyStrategy,
    heroMatch: isGravyHero,
  },
  {
    id: "marlynn",
    label: "Marlynn",
    description:
      "Zero to Eighty Marlynn: arsenal harpoons, fire them off pumps and Gold, and do not block the arrows.",
    strategy: marlynnStrategy,
    heroMatch: isMarlynnHero,
  },
  {
    id: "puffin",
    label: "Puffin",
    description:
      "Zero to Eighty Puffin: crank twice (Cog in the Machine), convert 2-cost on-hits, and hide Pummel.",
    strategy: puffinStrategy,
    heroMatch: isPuffinHero,
  },
  {
    id: "pleiades",
    label: "Pleiades",
    description:
      "Zero to Eighty Pleiades: land What Happens Next?, play suspense auras, then swing Cries of Encore.",
    strategy: pleiadesStrategy,
    heroMatch: isPleiadesHero,
  },
  {
    id: "kayo",
    label: "Kayo",
    description:
      "Zero to Eighty Kayo: send weak attacks so Kayo can set base 6; resolve Big Bully and Mocking Blow.",
    strategy: kayoStrategy,
    heroMatch: isKayoHero,
  },
  {
    id: "lyath",
    label: "Lyath Goldmane",
    description:
      "Zero to Eighty Lyath: stack suspense auras and pumps, then convert Tear Asunder; prefer Titan's Fist over expensive haymakers.",
    strategy: lyathStrategy,
    heroMatch: isLyathHero,
  },
  {
    id: "malice",
    label: "Malice, Domina of the Dead",
    description:
      "Masterclass Malice: turn the corpse loop — replay graveyard Zombies off {r},{t}, feed the graveyard with tutors, cash Zombies into Gates and Corrupted Corpses, and swing Vox-recruited bodies.",
    strategy: maliceStrategy,
    heroMatch: isMaliceHero,
  },
  {
    id: "viserai-the-forsaken",
    label: "Viserai, the Forsaken",
    description:
      "Viserai, the Forsaken: start the Runechant engine on a go-again aura, convert with Usurp Gloomblades off live auras, recycle with Deadwood Dirge / Revel in Runeblood, and keep the Gloomblades off the block.",
    strategy: viseraiForsakenStrategy,
    heroMatch: isViseraiForsakenHero,
  },
];
