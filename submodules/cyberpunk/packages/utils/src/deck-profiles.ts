/**
 * Deck strategy profiles for the authored bot-lab archetypes.
 *
 * Each profile encodes that list's plan for greedy/tactical: which cards
 * are central (never volunteered to `sellCard`, preferred when playing),
 * how to judge the opening hand, which Gear belongs on which host, and
 * whether the opening should develop before attacking.
 *
 * Profiles are authored with catalog display names (`Name: Subtitle`) to
 * match `authored-decks.ts`, then translated once to the engine-visible
 * printed name (`FilteredCardView.cardName`) at module load. An unknown or
 * stale name fails loudly here instead of silently never matching.
 */
import { structuredCards } from "@tcg/cyberpunk-cards";

import { authoredBotLabDeckSpecs } from "./authored-decks.ts";

export type AuthoredBotLabDeckId = (typeof authoredBotLabDeckSpecs)[number]["id"];

export type GearHostPreferType = "legend" | "unit";

export interface AuthoredDeckMulliganTuning {
  readonly cheapUnitCost?: number;
  readonly minCheapUnits?: number;
  readonly minSellable?: number;
  readonly engineNames?: readonly string[];
  readonly engineRelief?: number;
  readonly congestionNames?: readonly string[];
  readonly congestionMinCopies?: number;
}

export interface AuthoredDeckStrategyProfile {
  readonly deckId: string;
  readonly plan: string;
  readonly coreCards: readonly string[];
  readonly mulligan?: AuthoredDeckMulliganTuning;
  readonly gearHosts?: Readonly<Record<string, readonly string[]>>;
  readonly gearHostTypes?: Readonly<Record<string, GearHostPreferType>>;
  readonly blockDirectStealsAtLeast?: number;
  readonly pacing?: "develop-first" | "attack-first";
  readonly preferSpendOverAttack?: readonly string[];
}

const displayToEngineName = new Map<string, string>();
for (const card of structuredCards) {
  if (card.displayName) displayToEngineName.set(card.displayName, card.name);
}

function engineCardName(displayName: string): string {
  const exact = displayToEngineName.get(displayName);
  if (exact) return exact;
  throw new Error(`deck-profiles: unknown card display name: "${displayName}"`);
}

const rawDeckStrategyProfiles: Record<AuthoredBotLabDeckId, AuthoredDeckStrategyProfile> = {
  "authored-overwatch-recharge-control": {
    deckId: "authored-overwatch-recharge-control",
    plan: "Equip Overwatch and Sandevistan on a face-up Legend, keep one Eddie and a matching discard for the shot, and use Corpo/Shield for attacks that do not deserve it.",
    coreCards: [
      "Overwatch: Panam's Gift",
      "Panam Palmer: Strength Through Family",
      "Sandevistan",
      "Corporate Surveillance",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
      congestionNames: ["Sandayu Oda: Hanako's Guardian"],
      congestionMinCopies: 2,
    },
    gearHosts: {
      "Overwatch: Panam's Gift": [
        "Hanako Arasaka: Daughter of the Emperor",
        "Goro Takemura: Hands Unclean",
        "Viktor Vektor: Sit Down and Relax",
      ],
      Sandevistan: [
        "Hanako Arasaka: Daughter of the Emperor",
        "Goro Takemura: Hands Unclean",
        "Viktor Vektor: Sit Down and Relax",
      ],
    },
    gearHostTypes: {
      "Overwatch: Panam's Gift": "legend",
      Sandevistan: "legend",
    },
    blockDirectStealsAtLeast: 1,
    pacing: "develop-first",
  },
  "authored-alt-gears-multiplied-economy": {
    deckId: "authored-alt-gears-multiplied-economy",
    plan: "Spread useful Gear across carriers so ordinary spends draw; Alt multiplies equipped spends, Placide converts a Program into removal, and Bombus buys the setup.",
    coreCards: [
      "Alt Cunningham: Mother of Daemons",
      "NetWatch Netdriver",
      "Zetatech Faceplate",
      "Placide: Voodoo Sentinel",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
      congestionNames: ["Alt Cunningham: Mother of Daemons", "Placide: Voodoo Sentinel"],
      congestionMinCopies: 2,
    },
    gearHosts: {
      "NetWatch Netdriver": [
        "Viktor Vektor: Sit Down and Relax",
        "River Ward: Detective on the Hunt",
        "Jackie Welles: Pour One Out For Me",
      ],
      "Zetatech Faceplate": [
        "Viktor Vektor: Sit Down and Relax",
        "River Ward: Detective on the Hunt",
        "Jackie Welles: Pour One Out For Me",
      ],
      "Kiroshi Optics": [
        "Alt Cunningham: Mother of Daemons",
        "Placide: Voodoo Sentinel",
        "Viktor Vektor: You Might Feel a Little Pinch",
      ],
      "Mandibular Upgrade": ["Secondhand Bombus", "Viktor Vektor: You Might Feel a Little Pinch"],
    },
    gearHostTypes: {
      "NetWatch Netdriver": "legend",
      "Zetatech Faceplate": "legend",
      "Kiroshi Optics": "unit",
      "Mandibular Upgrade": "unit",
    },
    blockDirectStealsAtLeast: 1,
    pacing: "develop-first",
  },
  "authored-yorinobu-two-units-for-one": {
    deckId: "authored-yorinobu-two-units-for-one",
    plan: "Reach seven Eddies, play Yorinobu, and return the Unit the board actually needs. Sales and an affordable body come before the seven-drop.",
    coreCards: [
      "Yorinobu Arasaka: Steel Dragon",
      "The Heist",
      "Mantis Blades",
      "Meredith Stout: Stone Cold Corpo",
      "Viktor Vektor: You Might Feel a Little Pinch",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
      congestionNames: ["Yorinobu Arasaka: Steel Dragon", "Johnny Silverhand: Never Stop Fighting"],
      congestionMinCopies: 2,
    },
    gearHosts: {
      "Mantis Blades": ["Swordwise Huscle", "Yorinobu Arasaka: Steel Dragon"],
      "Satori: Sword of Saburo": [
        "Johnny Silverhand: Never Stop Fighting",
        "Yorinobu Arasaka: Steel Dragon",
      ],
      "Zetatech Faceplate": [
        "Yorinobu Arasaka: Steel Dragon",
        "Viktor Vektor: You Might Feel a Little Pinch",
      ],
    },
    gearHostTypes: {
      "Mantis Blades": "unit",
      "Satori: Sword of Saburo": "unit",
      "Zetatech Faceplate": "unit",
    },
    blockDirectStealsAtLeast: 1,
    pacing: "develop-first",
  },
  "authored-cyberpsychosis-deadman-burst-insurance": {
    deckId: "authored-cyberpsychosis-deadman-burst-insurance",
    plan: "Get a Unit down, stack Gear on the attacker that can actually take Gigs, and play Cyberpsychosis only after the route is clear. Deadman is insurance, not the first keep.",
    coreCards: [
      "Cyberpsychosis",
      "Johnny Silverhand: Never Stop Fighting",
      "Mantis Blades",
      "Swordwise Huscle",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
      congestionNames: ["Johnny Silverhand: Never Stop Fighting", "Yorinobu Arasaka: Steel Dragon"],
      congestionMinCopies: 2,
    },
    gearHosts: {
      "Mantis Blades": ["Johnny Silverhand: Never Stop Fighting", "Swordwise Huscle"],
      "Kiroshi Optics": ["Johnny Silverhand: Never Stop Fighting", "Swordwise Huscle"],
      "Zetatech Faceplate": ["Johnny Silverhand: Never Stop Fighting", "Swordwise Huscle"],
      "Deadman Transmitter": ["Johnny Silverhand: Never Stop Fighting"],
      "Mandibular Upgrade": ["Swordwise Huscle", "Dexter DeShawn: One Last Chance"],
      "Satori: Sword of Saburo": ["Johnny Silverhand: Never Stop Fighting"],
    },
    gearHostTypes: {
      "Mantis Blades": "unit",
      "Kiroshi Optics": "unit",
      "Zetatech Faceplate": "unit",
      "Deadman Transmitter": "unit",
      "Mandibular Upgrade": "unit",
      "Satori: Sword of Saburo": "unit",
    },
    pacing: "attack-first",
  },
  "authored-johnny-fight-ready-steal": {
    deckId: "authored-johnny-fight-ready-steal",
    plan: "Win a fight with Johnny, ready from the first fight win, then attack Gigs. Swordwise plus Mantis is the opening when Johnny is missing.",
    coreCards: [
      "Johnny Silverhand: Never Stop Fighting",
      "Satori: Sword of Saburo",
      "Corporate Surveillance",
      "Mantis Blades",
      "Swordwise Huscle",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
      congestionNames: ["Johnny Silverhand: Never Stop Fighting"],
      congestionMinCopies: 2,
    },
    gearHosts: {
      "Satori: Sword of Saburo": ["Johnny Silverhand: Never Stop Fighting"],
      "Mantis Blades": ["Swordwise Huscle", "Johnny Silverhand: Never Stop Fighting"],
      Sandevistan: ["Johnny Silverhand: Never Stop Fighting"],
      "Riot Shield": ["Corpo Security", "Goro Takemura: Losing His Way"],
    },
    gearHostTypes: {
      "Satori: Sword of Saburo": "unit",
      "Mantis Blades": "unit",
      Sandevistan: "unit",
      "Riot Shield": "unit",
    },
    blockDirectStealsAtLeast: 1,
    pacing: "attack-first",
  },
  "authored-hanako-netdriver-gigs-draw-engine": {
    deckId: "authored-hanako-netdriver-gigs-draw-engine",
    plan: "Netdriver and Sandevistan on Hanako draw from pair-swaps; Goro, Panam and Oda take Gigs. Overwatch shares the Legend spend, so it does not go on Panam.",
    coreCards: [
      "NetWatch Netdriver",
      "Sandevistan",
      "Peace Offering",
      "Panam Palmer: Strength Through Family",
      "Chrome Reverie",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
      congestionNames: ["Sandayu Oda: Hanako's Guardian"],
      congestionMinCopies: 2,
    },
    gearHosts: {
      "NetWatch Netdriver": [
        "Hanako Arasaka: Daughter of the Emperor",
        "Goro Takemura: Hands Unclean",
        "Alt Cunningham: Soulkiller Architect",
      ],
      Sandevistan: [
        "Hanako Arasaka: Daughter of the Emperor",
        "Goro Takemura: Hands Unclean",
        "Alt Cunningham: Soulkiller Architect",
      ],
      "Overwatch: Panam's Gift": [
        "Goro Takemura: Hands Unclean",
        "Alt Cunningham: Soulkiller Architect",
        "Hanako Arasaka: Daughter of the Emperor",
      ],
    },
    gearHostTypes: {
      "NetWatch Netdriver": "legend",
      Sandevistan: "legend",
      "Overwatch: Panam's Gift": "legend",
    },
    blockDirectStealsAtLeast: 1,
    pacing: "develop-first",
  },
  "authored-oda-industrial-assembly-pairs-plateaus": {
    deckId: "authored-oda-industrial-assembly-pairs-plateaus",
    plan: "Assembly and Peace set matching Gig values; Oda spends rival Units and fights on entry. Early Corpo/Squadron and a sale come before the seven-drop.",
    coreCards: [
      "Industrial Assembly",
      "Peace Offering",
      "Sandayu Oda: Hanako's Guardian",
      "Goro Takemura: Losing His Way",
      "Mantis Blades",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
      congestionNames: ["Sandayu Oda: Hanako's Guardian", "Minotaur"],
      congestionMinCopies: 2,
    },
    gearHosts: {
      "Mantis Blades": ["Sandayu Oda: Hanako's Guardian", "Goro Takemura: Losing His Way"],
      "Satori: Sword of Saburo": [
        "Goro Takemura: Losing His Way",
        "Sandayu Oda: Hanako's Guardian",
      ],
      Sandevistan: ["Hanako Arasaka: Daughter of the Emperor"],
    },
    gearHostTypes: {
      "Mantis Blades": "unit",
      "Satori: Sword of Saburo": "unit",
      Sandevistan: "legend",
    },
    blockDirectStealsAtLeast: 1,
    pacing: "develop-first",
  },
  "authored-judy-top-deck-discount": {
    deckId: "authored-judy-top-deck-discount",
    plan: "Nothing to Doubt's Spend (reveal top, play it free or take it) is the core line — fire it before attacking. Netdriver on the Judy Legend draws from that Legend spend. Expensive hits in hand are not top-deck discounts.",
    coreCards: [
      "Judy Álvarez: Nothing to Doubt",
      "NetWatch Netdriver",
      "Chrome Reverie",
      "Evelyn Parker: Scheming Siren",
    ],
    preferSpendOverAttack: ["Judy Álvarez: Nothing to Doubt"],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 2,
      minSellable: 1,
      engineNames: ["NetWatch Netdriver"],
      engineRelief: 1,
      congestionNames: ["Judy Álvarez: Nothing to Doubt", "Placide: Voodoo Sentinel"],
      congestionMinCopies: 3,
    },
    gearHosts: {
      "NetWatch Netdriver": [
        "Judy Álvarez: Braindance Maestro",
        "Judy Álvarez: Nothing to Doubt",
        "Evelyn Parker: Scheming Siren",
        "Jackie Welles: Pour One Out For Me",
        "Alt Cunningham: Soulkiller Architect",
      ],
    },
    gearHostTypes: {
      "NetWatch Netdriver": "legend",
    },
    pacing: "develop-first",
  },
  "authored-relic-placide-surgical-reanimation": {
    deckId: "authored-relic-placide-surgical-reanimation",
    plan: "Trash Placide with Heist, put Relic on a cheap Unit, defeat that carrier, and keep a second Program for Placide's Play effect. Draw Gear stays on Legends so Aftermath does not eat it.",
    coreCards: [
      "The Relic: Experimental Biochip",
      "Placide: Voodoo Sentinel",
      "The Heist",
      "Live with the Aftermath",
      "Secondhand Bombus",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
      congestionNames: ["Placide: Voodoo Sentinel"],
      congestionMinCopies: 2,
    },
    gearHosts: {
      "The Relic: Experimental Biochip": [
        "Secondhand Bombus",
        "Viktor Vektor: You Might Feel a Little Pinch",
      ],
      "NetWatch Netdriver": [
        "Viktor Vektor: Sit Down and Relax",
        "River Ward: Detective on the Hunt",
        "Alt Cunningham: Soulkiller Architect",
      ],
      "Zetatech Faceplate": [
        "Viktor Vektor: Sit Down and Relax",
        "River Ward: Detective on the Hunt",
        "Alt Cunningham: Soulkiller Architect",
      ],
      "Kiroshi Optics": ["Viktor Vektor: Sit Down and Relax", "River Ward: Detective on the Hunt"],
    },
    gearHostTypes: {
      "The Relic: Experimental Biochip": "unit",
      "NetWatch Netdriver": "legend",
      "Zetatech Faceplate": "legend",
      "Kiroshi Optics": "legend",
    },
    blockDirectStealsAtLeast: 1,
    pacing: "develop-first",
  },
  "authored-relic-smasher-total-sweep": {
    deckId: "authored-relic-smasher-total-sweep",
    plan: "Trash Smasher, Relic a cheap Unit, wipe the board, then protect Smasher through Lag. Do not rebuild a second field just before the sweep.",
    coreCards: [
      "The Relic: Experimental Biochip",
      "Adam Smasher: Metal Over Meat",
      "The Heist",
      "Live with the Aftermath",
      "Secondhand Bombus",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
      congestionNames: ["Adam Smasher: Metal Over Meat"],
      congestionMinCopies: 2,
    },
    gearHosts: {
      "The Relic: Experimental Biochip": [
        "Secondhand Bombus",
        "Dexter DeShawn: One Last Chance",
        "Viktor Vektor: You Might Feel a Little Pinch",
      ],
      "Zetatech Faceplate": [
        "Viktor Vektor: Sit Down and Relax",
        "River Ward: Detective on the Hunt",
        "Dum Dum: Maelstrom Triggerman",
      ],
      "Kiroshi Optics": [
        "Viktor Vektor: Sit Down and Relax",
        "River Ward: Detective on the Hunt",
        "Dum Dum: Maelstrom Triggerman",
      ],
      "Mandibular Upgrade": ["Secondhand Bombus", "Dexter DeShawn: One Last Chance"],
    },
    gearHostTypes: {
      "The Relic: Experimental Biochip": "unit",
      "Zetatech Faceplate": "legend",
      "Kiroshi Optics": "legend",
      "Mandibular Upgrade": "unit",
    },
    blockDirectStealsAtLeast: 1,
    pacing: "develop-first",
  },
  "authored-ryg-low-cost-value": {
    deckId: "authored-ryg-low-cost-value",
    plan: "Huscle plus Mantis is the opening rate. Faceplate belongs on Kerry so a spend can draw, adjust a Gig, and maybe draw again. Sell extra cheap cards, not the only Assembly or Faceplate. Attack once the board is online — Kerry spend is a choice, not an obligation.",
    coreCards: [
      "Swordwise Huscle",
      "Kerry Eurodyne: The Last Rockerboy",
      "Mantis Blades",
      "Zetatech Faceplate",
      "Industrial Assembly",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 1,
    },
    gearHosts: {
      "Mantis Blades": ["Swordwise Huscle"],
      "Zetatech Faceplate": ["Kerry Eurodyne: The Last Rockerboy"],
      "Satori: Sword of Saburo": [
        "Swordwise Huscle",
        "6th Street Recruits",
        "Kerry Eurodyne: The Last Rockerboy",
      ],
      "Arasaka Emergency Radioport": [
        "Yorinobu Arasaka: Embracing Destruction",
        "Goro Takemura: Hands Unclean",
      ],
    },
    gearHostTypes: {
      "Mantis Blades": "unit",
      "Zetatech Faceplate": "unit",
      "Satori: Sword of Saburo": "unit",
      "Arasaka Emergency Radioport": "legend",
    },
    blockDirectStealsAtLeast: 1,
    pacing: "develop-first",
  },
  "authored-ryb-low-cost-tempo": {
    deckId: "authored-ryb-low-cost-tempo",
    plan: "Develop a body first — Huscle plus Mantis, or Psycho Squad. Floor It cycles and shaves a fight; do not sell the last Mantis to fund a cantrip. Faceplate on Kerry is the spend engine. Stop cycling Programs once you can keep attacking.",
    coreCards: [
      "Swordwise Huscle",
      "Kerry Eurodyne: The Last Rockerboy",
      "Psycho Squad",
      "Mantis Blades",
      "Zetatech Faceplate",
    ],
    mulligan: {
      cheapUnitCost: 3,
      minCheapUnits: 1,
      minSellable: 2,
    },
    gearHosts: {
      "Mantis Blades": ["Swordwise Huscle"],
      "Zetatech Faceplate": ["Kerry Eurodyne: The Last Rockerboy"],
      "Satori: Sword of Saburo": [
        "Swordwise Huscle",
        "Psycho Squad",
        "Kerry Eurodyne: The Last Rockerboy",
      ],
      "Kiroshi Optics": [
        "Swordwise Huscle",
        "Kerry Eurodyne: The Last Rockerboy",
        "Viktor Vektor: You Might Feel a Little Pinch",
      ],
    },
    gearHostTypes: {
      "Mantis Blades": "unit",
      "Zetatech Faceplate": "unit",
      "Satori: Sword of Saburo": "unit",
      "Kiroshi Optics": "unit",
    },
    blockDirectStealsAtLeast: 1,
    pacing: "develop-first",
  },
};

function translateProfile(profile: AuthoredDeckStrategyProfile): AuthoredDeckStrategyProfile {
  const mulligan = profile.mulligan
    ? {
        ...profile.mulligan,
        engineNames: profile.mulligan.engineNames?.map(engineCardName),
        congestionNames: profile.mulligan.congestionNames?.map(engineCardName),
      }
    : undefined;
  const gearHosts = profile.gearHosts
    ? Object.fromEntries(
        Object.entries(profile.gearHosts).map(([gear, hosts]) => [
          engineCardName(gear),
          hosts.map(engineCardName),
        ]),
      )
    : undefined;
  const gearHostTypes = profile.gearHostTypes
    ? Object.fromEntries(
        Object.entries(profile.gearHostTypes).map(([gear, hostType]) => [
          engineCardName(gear),
          hostType,
        ]),
      )
    : undefined;
  return {
    ...profile,
    coreCards: profile.coreCards.map(engineCardName),
    mulligan,
    gearHosts,
    gearHostTypes,
    preferSpendOverAttack: profile.preferSpendOverAttack?.map(engineCardName),
  };
}

const translatedProfiles: Record<AuthoredBotLabDeckId, AuthoredDeckStrategyProfile> =
  Object.fromEntries(
    Object.entries(rawDeckStrategyProfiles).map(([deckId, profile]) => [
      deckId,
      translateProfile(profile),
    ]),
  ) as Record<AuthoredBotLabDeckId, AuthoredDeckStrategyProfile>;

export const authoredDeckStrategyProfiles: Readonly<
  Record<AuthoredBotLabDeckId, AuthoredDeckStrategyProfile>
> = translatedProfiles;

export const allDeckStrategyProfiles: readonly AuthoredDeckStrategyProfile[] =
  Object.values(translatedProfiles);

export function deckProfileFor(deckId: string): AuthoredDeckStrategyProfile | undefined {
  return (translatedProfiles as Record<string, AuthoredDeckStrategyProfile | undefined>)[deckId];
}
