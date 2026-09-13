/**
 * Engine-backed visual scenarios for hero-special UI review.
 *
 * Mounted under `/flesh-and-blood/simulator/tests/:id` via {@link FAB_ENGINE_SCENARIOS}.
 * Boards seed arena / banished / piles so {@link HeroSpecialArea} and the permanent
 * lane have something to render — not full rules fidelity.
 */
import { FabTestEngine, type FabTestFixture } from "@tcg/flesh-and-blood-engine/testing";
import {
  CATALOG_TEST_DEFINITIONS,
  catalogIds,
  type FabCardDefinitionInput,
  type FabPracticeMatch,
} from "@tcg/flesh-and-blood-engine/simulator";

import { HERO_SPECIAL_UI_CATALOG, type FabHeroSpecialUiRequirement } from "./catalog";
import {
  allHeroSpecialCardDefinitions,
  HERO_SPECIAL_HERO_DEFS,
  HERO_SPECIAL_OPPONENT,
} from "./visualCards";

export type FabHeroSpecialScenarioGroupId = "hero-special";

export interface FabHeroSpecialScenario {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly group: FabHeroSpecialScenarioGroupId;
  readonly tags: readonly string[];
  readonly viewerId: "player-1" | "player-2";
  readonly botMode: "off";
  readonly boot: () => FabPracticeMatch;
}

interface BoardSeed {
  readonly life?: number;
  readonly resources?: number;
  readonly ap?: number;
  readonly chi?: number;
  readonly soulCount?: number;
  readonly markedOpponent?: boolean;
  readonly weapon1?: readonly string[];
  readonly weapon2?: readonly string[];
  readonly head?: readonly string[];
  readonly chest?: readonly string[];
  readonly arms?: readonly string[];
  readonly legs?: readonly string[];
  readonly arena?: readonly string[];
  readonly banished?: readonly string[];
  readonly pitch?: readonly string[];
  readonly graveyard?: readonly string[];
  readonly arsenal?: readonly string[];
  readonly hand?: readonly string[];
  readonly opponentArena?: readonly string[];
  readonly opponentHead?: readonly string[];
  readonly opponentArms?: readonly string[];
}

const repeat = (id: string, n: number): string[] => Array.from({ length: n }, () => id);
const VISUAL_DECK = (size: number): string[] => repeat(catalogIds.nimblismBlue, size);

/** Compact visual seed per catalog family id (hasTextFixture heroes). */
const BOARD_SEEDS: Record<string, BoardSeed> = {
  dromai: {
    life: 32,
    resources: 1,
    ap: 1,
    arena: [...repeat("viz-ash", 3), "viz-aether-ashwing", "viz-azvolai"],
    pitch: ["viz-blood-debt-6"],
    hand: ["viz-blue-action", "viz-blue-action"],
  },
  levia: {
    life: 28,
    resources: 0,
    ap: 1,
    banished: [
      "viz-blood-debt-6",
      "viz-blood-debt-attack",
      "viz-blood-debt-attack",
      "viz-blood-debt-attack",
    ],
    hand: ["viz-blood-debt-6", "viz-blue-action"],
  },
  chane: {
    life: 30,
    resources: 2,
    ap: 1,
    arena: [...repeat("viz-soul-shackle", 2), ...repeat("viz-runechant", 3)],
    banished: ["viz-blood-debt-attack", "viz-blood-debt-attack", "viz-blood-debt-attack"],
  },
  vynnset: {
    life: 34,
    arena: repeat("viz-runechant", 4),
    banished: ["viz-blood-debt-attack", "viz-blue-action"],
  },
  boltyn: {
    life: 36,
    soulCount: 3,
    weapon1: ["viz-dawnblade"],
    arena: ["viz-might"],
    banished: ["viz-herald"],
  },
  "prism-sculptor": {
    life: 35,
    soulCount: 4,
    arena: repeat("viz-spectral-shield", 2),
    banished: ["viz-herald"],
  },
  "prism-awakener": {
    life: 33,
    soulCount: 2,
    arena: ["viz-figment-triumph", "viz-figment-tenacity", "viz-spectral-shield"],
    banished: ["viz-herald"],
  },
  nuu: {
    life: 32,
    chi: 3,
    banished: ["viz-combo"],
    hand: ["viz-blue-action", "viz-crouching-tiger"],
  },
  enigma: {
    life: 34,
    chi: 2,
    head: ["viz-equip-arms"],
    arena: repeat("viz-spectral-shield", 3),
  },
  zen: {
    life: 31,
    chi: 3,
    banished: ["viz-combo"],
    hand: ["viz-crouching-tiger", "viz-blue-action"],
  },
  maxx: {
    life: 28,
    resources: 2,
    arena: ["viz-hyper-driver", "viz-hyper-driver"],
  },
  dash: {
    life: 30,
    arena: ["viz-item-mech", "viz-hyper-driver"],
  },
  teklovossen: {
    life: 32,
    resources: 3,
    banished: ["viz-evo", "viz-evo"],
    arena: ["viz-item-mech"],
  },
  "data-doll": {
    life: 16,
    arena: ["viz-item-mech"],
    banished: ["viz-item-mech"],
  },
  malice: {
    life: 29,
    arena: ["viz-zombie", "viz-zombie"],
    banished: ["viz-corrupted-corpse", "viz-blue-action"],
    graveyard: ["viz-zombie"],
  },
  "gravy-bones": {
    life: 30,
    arena: repeat("viz-gold", 2),
    graveyard: ["viz-blue-action", "viz-zombie"],
    pitch: ["viz-blue-action"],
  },
  viserai: {
    life: 34,
    arena: repeat("viz-runechant", 6),
  },
  "viserai-forsaken": {
    life: 28,
    arena: repeat("viz-runechant", 5),
    banished: ["viz-blue-action", "viz-blood-debt-attack"],
  },
  "viserai-usurper": {
    life: 30,
    arena: ["viz-gate"],
    banished: ["viz-blood-debt-attack", "viz-blood-debt-attack"],
  },
  baalghor: {
    life: 25,
    banished: ["viz-blood-debt-6", "viz-blood-debt-attack", "viz-blue-action", "viz-combo"],
  },
  "arakni-chaos": {
    life: 32,
    markedOpponent: true,
    weapon1: ["viz-dagger"],
    weapon2: ["viz-dagger"],
  },
  cindra: {
    life: 33,
    markedOpponent: true,
    weapon1: ["viz-dagger"],
    weapon2: ["viz-dagger"],
    arena: repeat("viz-fealty", 2),
    graveyard: ["viz-dagger", "viz-dagger"],
  },
  fang: {
    life: 34,
    markedOpponent: true,
    weapon1: ["viz-dagger"],
    weapon2: ["viz-dagger"],
    arena: repeat("viz-fealty", 2),
  },
  blaze: {
    life: 15,
    resources: 2,
  },
  taylor: {
    life: 16,
    arms: ["viz-equip-arms"],
    legs: ["viz-equip-arms"],
  },
  librarian: {
    life: 18,
    hand: ["viz-tome"],
    graveyard: ["viz-tome"],
  },
  zyggy: {
    life: 32,
    resources: 2,
    arena: ["viz-lightning-flow", "viz-lightning-aura", "viz-lightning-aura"],
  },
  "aurora-flow": {
    life: 31,
    arena: [...repeat("viz-lightning-flow", 2), "viz-embodiment-lightning"],
  },
  "oscilio-flow": {
    life: 30,
    arena: ["viz-lightning-flow", ...repeat("viz-ponder", 2)],
  },
  pleiades: {
    life: 34,
    arena: ["viz-suspense-aura", "viz-suspense-aura", "viz-confidence"],
  },
  fai: {
    life: 33,
    graveyard: ["viz-phoenix-flame"],
    hand: ["viz-blue-action"],
  },
  "kassai-cintari": {
    life: 32,
    weapon1: ["viz-sword"],
    weapon2: ["viz-sword"],
    arena: [...repeat("viz-copper", 2), "viz-cintari-sellsword"],
  },
  "kassai-golden": {
    life: 33,
    weapon1: ["viz-sword"],
    weapon2: ["viz-sword"],
    arena: ["viz-gold"],
  },
  victor: {
    life: 36,
    arena: repeat("viz-gold", 3),
  },
  olympia: {
    life: 32,
    arena: repeat("viz-gold", 2),
  },
  puffin: {
    life: 30,
    arena: ["viz-gold", "viz-golden-cog"],
  },
  marlynn: {
    life: 31,
    arsenal: ["viz-arrow"],
    arena: ["viz-gold"],
    hand: ["viz-arrow"],
    weapon1: ["viz-bow"],
  },
  scurv: {
    life: 28,
    arena: ["viz-gold", ...repeat("viz-goldkiss-rum", 2)],
  },
  valda: {
    life: 35,
    arena: repeat("viz-seismic-surge", 4),
  },
  iyslander: {
    life: 30,
    arsenal: ["viz-blue-action"],
    opponentArena: repeat("viz-frostbite", 2),
  },
  lexi: {
    life: 32,
    arsenal: ["viz-arrow"],
    weapon1: ["viz-bow"],
    opponentArena: ["viz-frostbite"],
  },
  jarl: {
    life: 34,
    opponentHead: [], // exposed slots shown empty; frostbite in arena stand-in
    opponentArena: ["viz-frostbite", "viz-frostbite"],
    opponentArms: [],
  },
  briar: {
    life: 33,
    arena: ["viz-embodiment-earth", "viz-embodiment-lightning"],
  },
  "aurora-classic": {
    life: 32,
    arena: ["viz-embodiment-lightning"],
  },
  tuffnut: {
    life: 36,
    arena: repeat("viz-toughness", 2),
  },
  lyath: {
    life: 34,
    resources: 2,
    arena: repeat("viz-might", 2),
  },
  "kayo-sup": {
    life: 33,
    weapon1: ["viz-sword"],
    arena: ["viz-vigor"],
  },
  "kayo-hvy": {
    life: 34,
    weapon1: ["viz-sword"],
    arena: ["viz-might"],
  },
  uzuri: {
    life: 32,
    banished: ["viz-combo"],
    weapon1: ["viz-dagger"],
    weapon2: ["viz-dagger"],
  },
  kano: {
    life: 30,
    banished: ["viz-blue-action"],
    hand: ["viz-blue-action"],
  },
  florian: {
    life: 32,
    arena: [...repeat("viz-ponder", 2), "viz-spectral-shield"],
  },
  yorick: {
    life: 18,
    hand: ["viz-blue-action"],
  },
  melody: {
    life: 18,
    arena: repeat("viz-copper", 3),
  },
  brevant: {
    life: 18,
    arena: ["viz-might"],
  },
  terra: {
    life: 18,
    pitch: ["viz-earth-pitch"],
    arena: ["viz-might"],
  },
  reya: {
    life: 18,
    arena: ["viz-gold"],
  },
  squizzy: {
    life: 16,
    arena: repeat("viz-gold", 2),
  },
  genis: {
    life: 18,
    arena: repeat("viz-silver", 2),
  },
  kavdaen: {
    life: 18,
    resources: 3,
    arena: ["viz-copper"],
  },
  "fightmaster-kox": {
    life: 18,
    arena: ["viz-gold"],
  },
  betsy: {
    life: 34,
    resources: 2,
  },
  azalea: {
    life: 32,
    weapon1: ["viz-bow"],
    arsenal: ["viz-arrow"],
  },
  riptide: {
    life: 31,
    arsenal: ["viz-arrow"],
    hand: ["viz-blue-action"],
  },
  dorinthea: {
    life: 34,
    weapon1: ["viz-dawnblade"],
  },
  hala: {
    life: 32,
    resources: 3,
    weapon1: ["viz-sword"],
  },
  rhinar: {
    life: 36,
    banished: ["viz-blue-action"],
  },
  katsu: {
    life: 33,
    banished: ["viz-combo"],
  },
  "kayo-runt": {
    life: 17,
    hand: ["viz-blood-debt-6"],
  },
  crix: {
    life: 18,
    arena: ["viz-seismic-surge"],
  },
  frankie: {
    life: 18,
    resources: 3,
    chest: ["viz-equip-arms"],
    banished: ["viz-equip-arms"],
    graveyard: ["viz-equip-arms"],
  },
  "oscilio-classic": { life: 40, hand: ["viz-blue-action"] },
  "arakni-huntsman": { life: 40, opponentArena: ["viz-gold"] },
  "arakni-stealth": { life: 40, hand: ["viz-combo"] },
};

function matchFromEngine(engine: FabTestEngine, seed: string): FabPracticeMatch {
  return {
    runtime: engine.getRuntime(),
    engine,
    player1Id: "player-1",
    player2Id: "player-2",
    seed,
  };
}

function buildFixture(hero: FabHeroSpecialUiRequirement, seed: BoardSeed): FabTestFixture {
  const heroDef = HERO_SPECIAL_HERO_DEFS[hero.id];
  if (!heroDef) {
    throw new Error(`Missing visual hero def for ${hero.id}`);
  }

  const cardDefinitions: Record<string, FabCardDefinitionInput> = {
    ...CATALOG_TEST_DEFINITIONS,
    ...allHeroSpecialCardDefinitions(),
  };

  return {
    seed: `fab-hero-special-${hero.id}`,
    player1Id: "player-1",
    player2Id: "player-2",
    firstPlayerId: "player-1",
    cardDefinitions,
    player1: {
      heroCardId: heroDef.canonicalId,
      life: seed.life ?? heroDef.health ?? 20,
      actionPoints: seed.ap ?? 1,
      resourcePoints: seed.resources ?? 0,
      weapon1: seed.weapon1,
      weapon2: seed.weapon2,
      head: seed.head,
      chest: seed.chest,
      arms: seed.arms,
      legs: seed.legs,
      arena: seed.arena ?? [],
      banished: seed.banished ?? [],
      pitch: seed.pitch ?? [],
      graveyard: seed.graveyard ?? [],
      arsenal: seed.arsenal,
      hand: seed.hand ?? ["viz-blue-action", "viz-blue-action"],
      deck: VISUAL_DECK(10),
      chiPoints: seed.chi,
    },
    player2: {
      heroCardId: HERO_SPECIAL_OPPONENT.canonicalId,
      life: 36,
      weapon1: [catalogIds.anothos],
      head: seed.opponentHead ?? [catalogIds.helmIron],
      arms: seed.opponentArms,
      arena: seed.opponentArena ?? [],
      hand: [catalogIds.sinkBelow, catalogIds.crackedBauble],
      deck: VISUAL_DECK(10),
      marked: seed.markedOpponent,
    },
  };
}

function bootHeroSpecial(hero: FabHeroSpecialUiRequirement): FabPracticeMatch {
  const seed = BOARD_SEEDS[hero.id] ?? {};
  const fixture = buildFixture(hero, seed);
  const engine = FabTestEngine.create(fixture);
  return matchFromEngine(engine, fixture.seed ?? `fab-hero-special-${hero.id}`);
}

function scenarioId(heroId: string): string {
  return `hero-special-${heroId}`;
}

export const FAB_HERO_SPECIAL_SCENARIO_GROUP = {
  id: "hero-special" as const,
  label: "Hero special UI",
  description:
    "Visual boards for hero resources, tokens, soul, banished blood debt, chi, and signature permanents.",
};

/**
 * One scenario per catalog hero that has a text fixture board seed.
 * Ids: `hero-special-<catalogId>` e.g. `hero-special-dromai`.
 */
export const FAB_HERO_SPECIAL_SCENARIOS: readonly FabHeroSpecialScenario[] =
  HERO_SPECIAL_UI_CATALOG.filter(
    (hero) => HERO_SPECIAL_HERO_DEFS[hero.id] && BOARD_SEEDS[hero.id] !== undefined,
  ).map((hero) => {
    const must = hero.mustShow.slice(0, 2).join("; ");
    return {
      id: scenarioId(hero.id),
      label: `${hero.hero} · special UI`,
      description: `Tier ${hero.tier} · ${must}. Tokens/zones seeded for UI review (not full rules).`,
      group: "hero-special" as const,
      tags: [
        "hero-special",
        "visual",
        hero.id,
        `tier-${hero.tier.toLowerCase()}`,
        ...hero.signatureTokens.map((t) => t.toLowerCase().replace(/\s+/g, "-")).slice(0, 3),
      ],
      viewerId: "player-1" as const,
      botMode: "off" as const,
      boot: () => bootHeroSpecial(hero),
    };
  });

export function getHeroSpecialScenario(id: string | undefined): FabHeroSpecialScenario | undefined {
  if (!id) return undefined;
  return FAB_HERO_SPECIAL_SCENARIOS.find((s) => s.id === id);
}

/** Smoke-boot every scenario (used by unit tests). */
export function assertAllHeroSpecialScenariosBoot(): void {
  for (const scenario of FAB_HERO_SPECIAL_SCENARIOS) {
    const match = scenario.boot();
    const viewer = match.runtime.viewer({ role: "player", actorId: "player-1" });
    if (!viewer.players["player-1"]?.heroCardId) {
      throw new Error(`Scenario ${scenario.id} missing p1 hero`);
    }
  }
}

export function listMissingHeroSpecialSeeds(): string[] {
  return HERO_SPECIAL_UI_CATALOG.filter(
    (h) => !BOARD_SEEDS[h.id] || !HERO_SPECIAL_HERO_DEFS[h.id],
  ).map((h) => h.id);
}
