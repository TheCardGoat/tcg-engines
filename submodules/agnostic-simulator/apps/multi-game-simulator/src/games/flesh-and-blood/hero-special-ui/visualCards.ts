/**
 * Visual stand-in card definitions for hero-special UI fixtures.
 *
 * These are presentation-oriented engine definitions (names + types + stats).
 * They are not a substitute for the full catalog modules.
 */
import type { FabCardDefinitionInput } from "@tcg/flesh-and-blood-engine/simulator";

type VisualCardDefinition = Extract<FabCardDefinitionInput, { readonly types: readonly string[] }>;

function def(
  canonicalId: string,
  name: string,
  types: readonly string[],
  extras: Omit<Partial<VisualCardDefinition>, "canonicalId" | "name" | "types"> = {},
): VisualCardDefinition {
  return { canonicalId, name, types, ...extras };
}

/** Shared tokens / permanents used across hero special boards. */
export const HERO_SPECIAL_TOKEN_DEFS: Record<string, FabCardDefinitionInput> = {
  "viz-ash": def("viz-ash", "Ash", ["Token", "Ash", "Draconic", "Illusionist"]),
  "viz-aether-ashwing": def(
    "viz-aether-ashwing",
    "Aether Ashwing",
    ["Token", "Dragon", "Ally", "Draconic", "Illusionist"],
    { power: 1, health: 1 },
  ),
  "viz-azvolai": def("viz-azvolai", "Azvolai", ["Dragon", "Ally", "Draconic", "Illusionist"], {
    power: 6,
    health: 6,
  }),
  "viz-runechant": def("viz-runechant", "Runechant", ["Token", "Aura"]),
  "viz-soul-shackle": def("viz-soul-shackle", "Soul Shackle", ["Token", "Aura"]),
  "viz-spectral-shield": def("viz-spectral-shield", "Spectral Shield", [
    "Token",
    "Aura",
    "Illusionist",
  ]),
  "viz-figment-triumph": def("viz-figment-triumph", "Figment of Triumph", [
    "Figment",
    "Illusionist",
  ]),
  "viz-figment-tenacity": def(
    "viz-figment-tenacity",
    "Figment of Tenacity",
    ["Figment", "Illusionist", "Ally"],
    { power: 4, health: 4 },
  ),
  "viz-gold": def("viz-gold", "Gold", ["Token", "Item"]),
  "viz-copper": def("viz-copper", "Copper", ["Token", "Item"]),
  "viz-silver": def("viz-silver", "Silver", ["Token", "Item"]),
  "viz-might": def("viz-might", "Might", ["Token", "Aura"]),
  "viz-vigor": def("viz-vigor", "Vigor", ["Token", "Aura"]),
  "viz-toughness": def("viz-toughness", "Toughness", ["Token", "Aura"]),
  "viz-confidence": def("viz-confidence", "Confidence", ["Token", "Aura"]),
  "viz-ponder": def("viz-ponder", "Ponder", ["Token", "Aura"]),
  "viz-fealty": def("viz-fealty", "Fealty", ["Token", "Aura", "Draconic"]),
  "viz-frostbite": def("viz-frostbite", "Frostbite", ["Token", "Aura", "Elemental"]),
  "viz-seismic-surge": def("viz-seismic-surge", "Seismic Surge", ["Token", "Aura"]),
  "viz-embodiment-earth": def("viz-embodiment-earth", "Embodiment of Earth", [
    "Token",
    "Aura",
    "Elemental",
  ]),
  "viz-embodiment-lightning": def("viz-embodiment-lightning", "Embodiment of Lightning", [
    "Token",
    "Aura",
    "Elemental",
  ]),
  "viz-lightning-flow": def("viz-lightning-flow", "Lightning Flow", ["Token", "Aura", "Elemental"]),
  "viz-hyper-driver": def("viz-hyper-driver", "Hyper Driver", ["Token", "Item", "Mechanologist"]),
  "viz-golden-cog": def("viz-golden-cog", "Golden Cog", ["Token", "Item", "Mechanologist", "Cog"], {
    keywords: [{ name: "crank" }],
  }),
  "viz-goldkiss-rum": def("viz-goldkiss-rum", "Goldkiss Rum", ["Token", "Item"]),
  "viz-zombie": def("viz-zombie", "Risen Zombie", ["Ally", "Zombie"], { power: 3, health: 2 }),
  "viz-corrupted-corpse": def("viz-corrupted-corpse", "Corrupted Corpse", ["Token"]),
  "viz-phoenix-flame": def("viz-phoenix-flame", "Phoenix Flame", ["Action", "Draconic"], {
    pitch: 1,
    cost: 0,
    power: 4,
    defense: 3,
  }),
  "viz-crouching-tiger": def("viz-crouching-tiger", "Crouching Tiger", ["Attack", "Action"], {
    pitch: 1,
    cost: 0,
    power: 3,
    defense: 2,
  }),
  "viz-blood-debt-attack": def(
    "viz-blood-debt-attack",
    "Shadow of Blasmophet",
    ["Attack", "Action", "Shadow"],
    {
      pitch: 1,
      cost: 2,
      power: 6,
      defense: 3,
      keywords: [{ name: "blood-debt" }],
    },
  ),
  "viz-blood-debt-6": def(
    "viz-blood-debt-6",
    "Wrecker Romp (BD stand-in)",
    ["Attack", "Action", "Shadow", "Brute"],
    {
      pitch: 2,
      cost: 2,
      power: 6,
      defense: 3,
      keywords: [{ name: "blood-debt" }],
    },
  ),
  "viz-blue-action": def("viz-blue-action", "Nimblism (Blue)", ["Action", "Generic"], {
    pitch: 3,
    cost: 0,
    defense: 2,
  }),
  "viz-earth-pitch": def("viz-earth-pitch", "Earth Pitch (Blue)", ["Action", "Elemental"], {
    pitch: 3,
    cost: 0,
    defense: 2,
    color: "Blue",
  }),
  "viz-lightning-aura": def("viz-lightning-aura", "Lightning Aura", ["Aura", "Lightning"]),
  "viz-suspense-aura": def("viz-suspense-aura", "Aura of Suspense", ["Aura"]),
  "viz-gate": def("viz-gate", "Gate to i'Arathael", ["Landmark", "Shadow"]),
  "viz-evo": def(
    "viz-evo",
    "Evo Steel Soul Module",
    ["Evo", "Mechanologist", "Equipment", "Chest"],
    {
      cost: 2,
      defense: 1,
    },
  ),
  "viz-combo": def("viz-combo", "Flic Flak", ["Attack", "Action", "Ninja"], {
    pitch: 1,
    cost: 0,
    power: 3,
    defense: 2,
    keywords: [{ name: "combo" }],
  }),
  "viz-arrow": def("viz-arrow", "Red in the Ledger", ["Attack", "Action", "Arrow", "Ranger"], {
    pitch: 1,
    cost: 1,
    power: 5,
    defense: 3,
  }),
  "viz-dagger": def("viz-dagger", "Draconic Dagger", ["Weapon", "Dagger", "1H", "Draconic"], {
    power: 1,
  }),
  "viz-sword": def("viz-sword", "Cintari Saber", ["Weapon", "Sword", "1H", "Warrior"], {
    power: 2,
  }),
  "viz-dawnblade": def("viz-dawnblade", "Dawnblade", ["Weapon", "Sword", "2H", "Warrior"], {
    power: 3,
  }),
  "viz-bow": def("viz-bow", "Death Dealer", ["Weapon", "Bow", "2H", "Ranger"]),
  "viz-tome": def("viz-tome", "Tome of Firebrand", ["Action", "Generic"], {
    pitch: 3,
    cost: 0,
  }),
  "viz-equip-arms": def("viz-equip-arms", "Snapdragon Scalers", ["Equipment", "Legs"], {
    defense: 0,
  }),
  "viz-cracked-bauble": def("viz-cracked-bauble", "Cracked Bauble", ["Resource", "Generic"], {
    pitch: 3,
  }),
  "viz-herald": def("viz-herald", "Herald of Triumph", ["Attack", "Action", "Light"], {
    pitch: 1,
    cost: 2,
    power: 4,
    defense: 3,
  }),
  "viz-item-mech": def("viz-item-mech", "Teklo Foundry Heart", ["Item", "Mechanologist"], {
    cost: 2,
  }),
  "viz-cintari-sellsword": def(
    "viz-cintari-sellsword",
    "Cintari Sellsword",
    ["Token", "Ally", "Warrior", "Mercenary"],
    { power: 3, health: 2 },
  ),
};

/** Hero stand-ins keyed by catalog family id. */
export const HERO_SPECIAL_HERO_DEFS: Record<string, FabCardDefinitionInput> = {
  dromai: def("viz-hero-dromai", "Dromai, Ash Artist", ["Hero", "Draconic", "Illusionist"], {
    health: 40,
    intelligence: 4,
  }),
  levia: def("viz-hero-levia", "Levia, Shadowborn Abomination", ["Hero", "Shadow", "Brute"], {
    health: 40,
    intelligence: 4,
  }),
  chane: def("viz-hero-chane", "Chane, Bound by Shadow", ["Hero", "Shadow", "Runeblade"], {
    health: 40,
    intelligence: 4,
  }),
  vynnset: def("viz-hero-vynnset", "Vynnset, Iron Maiden", ["Hero", "Shadow", "Runeblade"], {
    health: 40,
    intelligence: 4,
  }),
  boltyn: def("viz-hero-boltyn", "Ser Boltyn, Breaker of Dawn", ["Hero", "Light", "Warrior"], {
    health: 40,
    intelligence: 4,
  }),
  "prism-sculptor": def(
    "viz-hero-prism-sculptor",
    "Prism, Sculptor of Arc Light",
    ["Hero", "Light", "Illusionist"],
    { health: 40, intelligence: 4 },
  ),
  "prism-awakener": def(
    "viz-hero-prism-awakener",
    "Prism, Awakener of Sol",
    ["Hero", "Light", "Illusionist"],
    { health: 40, intelligence: 4 },
  ),
  nuu: def("viz-hero-nuu", "Nuu, Alluring Desire", ["Hero", "Mystic", "Assassin"], {
    health: 40,
    intelligence: 4,
  }),
  enigma: def("viz-hero-enigma", "Enigma, Ledger of Ancestry", ["Hero", "Mystic", "Illusionist"], {
    health: 40,
    intelligence: 4,
  }),
  zen: def("viz-hero-zen", "Zen, Tamer of Purpose", ["Hero", "Mystic", "Ninja"], {
    health: 40,
    intelligence: 4,
  }),
  maxx: def("viz-hero-maxx", "Maxx 'The Hype' Nitro", ["Hero", "Mechanologist"], {
    health: 36,
    intelligence: 4,
  }),
  dash: def("viz-hero-dash", "Dash I/O", ["Hero", "Mechanologist"], {
    health: 36,
    intelligence: 4,
  }),
  teklovossen: def(
    "viz-hero-teklovossen",
    "Teklovossen, Esteemed Magnate",
    ["Hero", "Mechanologist"],
    { health: 40, intelligence: 4 },
  ),
  "data-doll": def("viz-hero-data-doll", "Data Doll MKII", ["Hero", "Mechanologist"], {
    health: 16,
    intelligence: 4,
  }),
  malice: def("viz-hero-malice", "Malice, Domina of the Dead", ["Hero", "Necromancer"], {
    health: 40,
    intelligence: 4,
  }),
  "gravy-bones": def(
    "viz-hero-gravy-bones",
    "Gravy Bones, Shipwrecked Looter",
    ["Hero", "Pirate", "Necromancer"],
    { health: 40, intelligence: 4 },
  ),
  viserai: def("viz-hero-viserai", "Viserai, Rune Blood", ["Hero", "Runeblade"], {
    health: 40,
    intelligence: 4,
  }),
  "viserai-forsaken": def(
    "viz-hero-viserai-forsaken",
    "Viserai, the Forsaken",
    ["Hero", "Shadow", "Runeblade"],
    { health: 40, intelligence: 4 },
  ),
  "viserai-usurper": def(
    "viz-hero-viserai-usurper",
    "Viserai, Usurper",
    ["Hero", "Shadow", "Runeblade", "Demon"],
    { health: 40, intelligence: 4 },
  ),
  baalghor: def("viz-hero-baalghor", "Baalghor, Omen of the End", ["Hero", "Shadow", "Demon"], {
    health: 33,
    intelligence: 3,
  }),
  "arakni-chaos": def(
    "viz-hero-arakni-chaos",
    "Arakni, Marionette",
    ["Hero", "Chaos", "Assassin"],
    { health: 40, intelligence: 4 },
  ),
  cindra: def(
    "viz-hero-cindra",
    "Cindra, Dracai of Retribution",
    ["Hero", "Royal", "Draconic", "Ninja"],
    { health: 40, intelligence: 4 },
  ),
  fang: def("viz-hero-fang", "Fang, Dracai of Blades", ["Hero", "Royal", "Draconic", "Warrior"], {
    health: 40,
    intelligence: 4,
  }),
  blaze: def("viz-hero-blaze", "Blaze, Firemind", ["Hero", "Wizard"], {
    health: 17,
    intelligence: 4,
  }),
  taylor: def("viz-hero-taylor", "Taylor", ["Hero", "Shapeshifter", "Young"], {
    health: 18,
    intelligence: 4,
  }),
  librarian: def(
    "viz-hero-librarian",
    "The Librarian, Magister of History",
    ["Hero", "Light", "Adjudicator"],
    { health: 20, intelligence: 4 },
  ),
  zyggy: def("viz-hero-zyggy", "Zyggy, Starlight", ["Hero", "Lightning", "Illusionist"], {
    health: 40,
    intelligence: 4,
  }),
  "aurora-flow": def(
    "viz-hero-aurora-flow",
    "Aurora, Legacy of Tempest",
    ["Hero", "Lightning", "Runeblade"],
    { health: 40, intelligence: 4 },
  ),
  "oscilio-flow": def(
    "viz-hero-oscilio-flow",
    "Oscilio, Forked Continuum",
    ["Hero", "Lightning", "Wizard"],
    { health: 40, intelligence: 4 },
  ),
  pleiades: def("viz-hero-pleiades", "Pleiades, Superstar", ["Hero", "Guardian"], {
    health: 40,
    intelligence: 4,
  }),
  fai: def("viz-hero-fai", "Fai, Rising Rebellion", ["Hero", "Draconic", "Ninja"], {
    health: 40,
    intelligence: 4,
  }),
  "kassai-cintari": def(
    "viz-hero-kassai-cintari",
    "Kassai, Cintari Sellsword",
    ["Hero", "Warrior"],
    { health: 20, intelligence: 4 },
  ),
  "kassai-golden": def("viz-hero-kassai-golden", "Kassai of the Golden Sand", ["Hero", "Warrior"], {
    health: 40,
    intelligence: 4,
  }),
  victor: def("viz-hero-victor", "Victor Goldmane, High and Mighty", ["Hero", "Guardian"], {
    health: 40,
    intelligence: 4,
  }),
  olympia: def("viz-hero-olympia", "Olympia, Prized Fighter", ["Hero", "Warrior"], {
    health: 40,
    intelligence: 4,
  }),
  puffin: def("viz-hero-puffin", "Puffin, Hightail", ["Hero", "Mechanologist", "Pirate"], {
    health: 40,
    intelligence: 4,
  }),
  marlynn: def("viz-hero-marlynn", "Marlynn, Treasure Hunter", ["Hero", "Ranger", "Pirate"], {
    health: 40,
    intelligence: 4,
  }),
  scurv: def("viz-hero-scurv", "Scurv, Stowaway", ["Hero", "Pirate"], {
    health: 20,
    intelligence: 4,
  }),
  valda: def("viz-hero-valda", "Valda, Seismic Impact", ["Hero", "Guardian"], {
    health: 40,
    intelligence: 4,
  }),
  iyslander: def("viz-hero-iyslander", "Iyslander, Stormbind", ["Hero", "Elemental", "Wizard"], {
    health: 40,
    intelligence: 4,
  }),
  lexi: def("viz-hero-lexi", "Lexi, Livewire", ["Hero", "Elemental", "Ranger"], {
    health: 40,
    intelligence: 4,
  }),
  jarl: def("viz-hero-jarl", "Jarl Vetreiði", ["Hero", "Elemental", "Guardian"], {
    health: 40,
    intelligence: 4,
  }),
  briar: def("viz-hero-briar", "Briar, Warden of Thorns", ["Hero", "Elemental", "Runeblade"], {
    health: 40,
    intelligence: 4,
  }),
  "aurora-classic": def(
    "viz-hero-aurora-classic",
    "Aurora, Shooting Star",
    ["Hero", "Elemental", "Runeblade"],
    { health: 40, intelligence: 4 },
  ),
  tuffnut: def("viz-hero-tuffnut", "Tuffnut, Bumbling Hulkster", ["Hero", "Revered", "Brute"], {
    health: 40,
    intelligence: 3,
  }),
  lyath: def("viz-hero-lyath", "Lyath Goldmane, Vile Savant", ["Hero", "Reviled", "Guardian"], {
    health: 40,
    intelligence: 4,
  }),
  "kayo-sup": def("viz-hero-kayo-sup", "Kayo, Underhanded Cheat", ["Hero", "Brute"], {
    health: 40,
    intelligence: 4,
  }),
  "kayo-hvy": def("viz-hero-kayo-hvy", "Kayo, Armed and Dangerous", ["Hero", "Brute"], {
    health: 40,
    intelligence: 4,
  }),
  uzuri: def("viz-hero-uzuri", "Uzuri, Switchblade", ["Hero", "Assassin"], {
    health: 40,
    intelligence: 4,
  }),
  kano: def("viz-hero-kano", "Kano, Dracai of Aether", ["Hero", "Wizard"], {
    health: 40,
    intelligence: 4,
  }),
  florian: def(
    "viz-hero-florian",
    "Florian, Rotwood Harbinger",
    ["Hero", "Elemental", "Illusionist"],
    { health: 40, intelligence: 4 },
  ),
  yorick: def("viz-hero-yorick", "Yorick, Weaver of Tales", ["Hero", "Bard", "Young"], {
    health: 20,
    intelligence: 4,
  }),
  melody: def("viz-hero-melody", "Melody, Sing-Along", ["Hero", "Bard", "Young"], {
    health: 20,
    intelligence: 4,
  }),
  brevant: def("viz-hero-brevant", "Brevant, Civic Protector", ["Hero", "Guardian", "Young"], {
    health: 20,
    intelligence: 4,
  }),
  terra: def("viz-hero-terra", "Terra", ["Hero", "Elemental", "Guardian", "Young"], {
    health: 20,
    intelligence: 4,
  }),
  reya: def("viz-hero-reya", "Reya, the Unyielding", ["Hero", "Guardian", "Pit-Fighter"], {
    health: 20,
    intelligence: 4,
  }),
  squizzy: def("viz-hero-squizzy", "Squizzy & Floof", ["Hero", "Merchant"], {
    health: 16,
    intelligence: 4,
  }),
  genis: def("viz-hero-genis", "Genis Wotchuneed", ["Hero", "Merchant"], {
    health: 20,
    intelligence: 4,
  }),
  kavdaen: def("viz-hero-kavdaen", "Kavdaen, Trader of Skins", ["Hero", "Merchant"], {
    health: 20,
    intelligence: 4,
  }),
  "fightmaster-kox": def(
    "viz-hero-fightmaster-kox",
    "Fightmaster Kox",
    ["Hero", "Guardian", "Pit-Fighter"],
    { health: 20, intelligence: 4 },
  ),
  betsy: def("viz-hero-betsy", "Betsy, Skin in the Game", ["Hero", "Guardian"], {
    health: 40,
    intelligence: 4,
  }),
  azalea: def("viz-hero-azalea", "Azalea, Ace in the Hole", ["Hero", "Ranger"], {
    health: 40,
    intelligence: 4,
  }),
  riptide: def("viz-hero-riptide", "Riptide, Lurker of the Deep", ["Hero", "Ranger"], {
    health: 40,
    intelligence: 4,
  }),
  dorinthea: def("viz-hero-dorinthea", "Dorinthea, Ironsong", ["Hero", "Warrior"], {
    health: 40,
    intelligence: 4,
  }),
  hala: def("viz-hero-hala", "Hala, Bladesaint of the Vow", ["Hero", "Warrior"], {
    health: 40,
    intelligence: 4,
  }),
  rhinar: def("viz-hero-rhinar", "Rhinar, Reckless Rampage", ["Hero", "Brute"], {
    health: 40,
    intelligence: 4,
  }),
  katsu: def("viz-hero-katsu", "Katsu, the Wanderer", ["Hero", "Ninja"], {
    health: 40,
    intelligence: 4,
  }),
  "kayo-runt": def("viz-hero-kayo-runt", "Kayo, Berserker Runt", ["Hero", "Brute", "Young"], {
    health: 17,
    intelligence: 4,
  }),
  crix: def("viz-hero-crix", "Groundbreaker Crix", ["Hero", "Guardian", "Pit-Fighter"], {
    health: 20,
    intelligence: 4,
  }),
  frankie: def("viz-hero-frankie", "Frankie, Make Ends Meat", ["Hero", "Necromancer", "Young"], {
    health: 20,
    intelligence: 4,
  }),
  "oscilio-classic": def(
    "viz-hero-oscilio-classic",
    "Oscilio, Constella Intelligence",
    ["Hero", "Wizard"],
    {
      health: 40,
      intelligence: 4,
    },
  ),
  "arakni-huntsman": def("viz-hero-arakni-huntsman", "Arakni, Huntsman", ["Hero", "Assassin"], {
    health: 40,
    intelligence: 4,
  }),
  "arakni-stealth": def(
    "viz-hero-arakni-stealth",
    "Arakni, Solitary Confinement",
    ["Hero", "Assassin"],
    {
      health: 40,
      intelligence: 4,
    },
  ),
};

export const HERO_SPECIAL_OPPONENT = def(
  "viz-hero-opponent",
  "Bravo, Showstopper",
  ["Hero", "Guardian"],
  { health: 40, intelligence: 4 },
);

export function allHeroSpecialCardDefinitions(): Record<string, FabCardDefinitionInput> {
  // Engine lookups are by canonicalId, not catalog family id.
  const heroesByCanonical: Record<string, FabCardDefinitionInput> = {};
  for (const def of Object.values(HERO_SPECIAL_HERO_DEFS)) {
    heroesByCanonical[def.canonicalId] = def;
  }
  return {
    ...HERO_SPECIAL_TOKEN_DEFS,
    ...heroesByCanonical,
    [HERO_SPECIAL_OPPONENT.canonicalId]: HERO_SPECIAL_OPPONENT,
  };
}
