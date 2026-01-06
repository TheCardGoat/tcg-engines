/**
 * Legacy Metadata Converter
 *
 * Converts legacy card metadata to new format properties.
 * Handles property name changes and new required fields.
 */

import type {
  ActionCard,
  CharacterCard,
  Classification,
  ItemCard,
  LocationCard,
} from "@tcg/lorcana-types";
import type {
  LegacyActionCard,
  LegacyCard,
  LegacyCharacterCard,
  LegacyItemCard,
} from "./legacy-ability-types";

/**
 * Map legacy ink color names to new format
 */
const INK_COLOR_MAP: Record<
  string,
  "amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel"
> = {
  amber: "amber",
  amethyst: "amethyst",
  emerald: "emerald",
  ruby: "ruby",
  sapphire: "sapphire",
  steel: "steel",
};

/**
 * Map legacy rarity to new format
 */
const RARITY_MAP: Record<
  string,
  "common" | "uncommon" | "rare" | "super_rare" | "legendary"
> = {
  common: "common",
  uncommon: "uncommon",
  rare: "rare",
  super_rare: "super_rare",
  legendary: "legendary",
};

/**
 * Convert legacy card to new format
 *
 * @param legacyCard - Legacy card object
 * @param franchise - Franchise name (may need manual mapping)
 * @returns New format card
 */
export function convertLegacyCard(
  legacyCard: LegacyCard,
  franchise?: string,
): CharacterCard | ActionCard | ItemCard | LocationCard {
  if (legacyCard.type === "character") {
    return convertLegacyCharacterCard(legacyCard, franchise);
  }

  if (legacyCard.type === "action") {
    // Check if it's a song
    const isSong = legacyCard.characteristics.includes("song");
    if (isSong) {
      return convertLegacySongCard(legacyCard, franchise);
    }
    return convertLegacyActionCard(legacyCard, franchise);
  }

  if (legacyCard.type === "item") {
    return convertLegacyItemCard(legacyCard, franchise);
  }

  throw new Error(
    `Unknown legacy card type: ${(legacyCard as { type: string }).type}`,
  );
}

/**
 * Convert legacy character card
 */
function convertLegacyCharacterCard(
  legacyCard: LegacyCharacterCard,
  franchise?: string,
): CharacterCard {
  return {
    id: legacyCard.id,
    cardType: "character",
    name: legacyCard.name,
    version: legacyCard.title,
    fullName: `${legacyCard.name} - ${legacyCard.title}`,
    inkType: convertInkColors(legacyCard.colors),
    franchise: franchise ?? inferFranchise(legacyCard.name),
    set: convertSetCode(legacyCard.set),
    text: legacyCard.text,
    cost: legacyCard.cost,
    strength: legacyCard.strength,
    willpower: legacyCard.willpower,
    lore: legacyCard.lore,
    cardNumber: legacyCard.number,
    inkable: legacyCard.inkwell,
    rarity: convertRarity(legacyCard.rarity),
    externalIds: {
      ravensburger:
        legacyCard.externalIds?.ravensburger ??
        generateRavensburgerId(legacyCard),
      tcgPlayer: legacyCard.externalIds?.tcgPlayer,
    },
    abilities: [], // Will be populated by ability converter
    classifications: convertCharacteristics(
      legacyCard.characteristics,
    ) as Classification[],
  };
}

/**
 * Convert legacy action card
 */
function convertLegacyActionCard(
  legacyCard: LegacyActionCard,
  franchise?: string,
): ActionCard {
  return {
    id: legacyCard.id,
    cardType: "action",
    name: legacyCard.name,
    version: "", // Actions don't have versions
    fullName: legacyCard.name,
    inkType: convertInkColors(legacyCard.colors),
    franchise: franchise ?? inferFranchise(legacyCard.name),
    set: convertSetCode(legacyCard.set),
    text: legacyCard.text,
    cost: legacyCard.cost,
    cardNumber: legacyCard.number,
    inkable: legacyCard.inkwell,
    rarity: convertRarity(legacyCard.rarity),
    externalIds: {
      ravensburger:
        legacyCard.externalIds?.ravensburger ??
        generateRavensburgerId(legacyCard),
      tcgPlayer: legacyCard.externalIds?.tcgPlayer,
    },
    abilities: [], // Will be populated by ability converter
  };
}

/**
 * Convert legacy song card
 *
 * Songs are stored as action cards in legacy format with "song" characteristic
 * In the new format, songs are ActionCard with actionSubtype: "song"
 */
function convertLegacySongCard(
  legacyCard: LegacyActionCard,
  franchise?: string,
): ActionCard {
  return {
    id: legacyCard.id,
    cardType: "action",
    actionSubtype: "song",
    name: legacyCard.name,
    version: "", // Songs don't have versions
    fullName: legacyCard.name,
    inkType: convertInkColors(legacyCard.colors),
    franchise: franchise ?? inferFranchise(legacyCard.name),
    set: convertSetCode(legacyCard.set),
    text: legacyCard.text,
    cost: legacyCard.cost,
    cardNumber: legacyCard.number,
    inkable: legacyCard.inkwell,
    rarity: convertRarity(legacyCard.rarity),
    externalIds: {
      ravensburger:
        legacyCard.externalIds?.ravensburger ??
        generateRavensburgerId(legacyCard),
      tcgPlayer: legacyCard.externalIds?.tcgPlayer,
    },
    abilities: [], // Will be populated by ability converter
  };
}

/**
 * Convert legacy item card
 */
function convertLegacyItemCard(
  legacyCard: LegacyItemCard,
  franchise?: string,
): ItemCard {
  return {
    id: legacyCard.id,
    cardType: "item",
    name: legacyCard.name,
    version: legacyCard.title ?? "",
    fullName: legacyCard.title
      ? `${legacyCard.name} - ${legacyCard.title}`
      : legacyCard.name,
    inkType: convertInkColors(legacyCard.colors),
    franchise: franchise ?? inferFranchise(legacyCard.name),
    set: convertSetCode(legacyCard.set),
    text: legacyCard.text,
    cost: legacyCard.cost,
    cardNumber: legacyCard.number,
    inkable: legacyCard.inkwell,
    rarity: convertRarity(legacyCard.rarity),
    externalIds: {
      ravensburger:
        legacyCard.externalIds?.ravensburger ??
        generateRavensburgerId(legacyCard),
      tcgPlayer: legacyCard.externalIds?.tcgPlayer,
    },
    abilities: [], // Will be populated by ability converter
    ...(legacyCard.durability !== undefined && {
      durability: legacyCard.durability,
    }),
  };
}

/**
 * Convert ink colors
 */
function convertInkColors(
  colors: string[],
): ("amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel")[] {
  return colors.map((color) => {
    const mapped = INK_COLOR_MAP[color.toLowerCase()];
    if (!mapped) {
      console.warn(`Unknown ink color: ${color}`);
      return color as "amber";
    }
    return mapped;
  });
}

/**
 * Convert characteristics (capitalize properly)
 */
function convertCharacteristics(characteristics: string[]): string[] {
  return characteristics.map((c) => {
    // Capitalize first letter
    return c.charAt(0).toUpperCase() + c.slice(1);
  });
}

/**
 * Convert rarity
 */
function convertRarity(
  rarity?: string,
): "common" | "uncommon" | "rare" | "super_rare" | "legendary" | undefined {
  if (!rarity) {
    return undefined;
  }
  const mapped = RARITY_MAP[rarity.toLowerCase()];
  if (!mapped) {
    console.warn(`Unknown rarity: ${rarity}`);
    return undefined;
  }
  return mapped;
}

/**
 * Convert set code
 * Legacy uses "TFC", "RDF", etc.
 * New format uses "001", "002", etc.
 */
function convertSetCode(set: string): string {
  const SET_MAP: Record<string, string> = {
    TFC: "001",
    RDF: "002",
    EI: "003",
    ITR: "004",
    SS: "005",
    UR: "006",
  };

  const mapped = SET_MAP[set];
  if (!mapped) {
    console.warn(`Unknown set code: ${set}`);
    return set;
  }
  return mapped;
}

/**
 * Infer franchise from card name
 * This is a simplified version - may need manual overrides for some cards
 */
function inferFranchise(name: string): string {
  // Map common character names to franchises
  const FRANCHISE_MAP: Record<string, string> = {
    // The Little Mermaid
    Ariel: "The Little Mermaid",
    Ursula: "The Little Mermaid",
    Prince_Eric: "The Little Mermaid",
    Sebastian: "The Little Mermaid",
    Flounder: "The Little Mermaid",
    King_Triton: "The Little Mermaid",

    // Cinderella
    Cinderella: "Cinderella",
    Fairy_Godmother: "Cinderella",
    Prince_Charming: "Cinderella",
    Lady_Tremaine: "Cinderella",
    Anastasia: "Cinderella",
    Drizella: "Cinderella",
    Lucifer: "Cinderella",

    // Snow White
    Snow_White: "Snow White and the Seven Dwarfs",
    Evil_Queen: "Snow White and the Seven Dwarfs",
    Magic_Mirror: "Snow White and the Seven Dwarfs",

    // Sleeping Beauty
    Aurora: "Sleeping Beauty",
    Maleficent: "Sleeping Beauty",
    Prince_Phillip: "Sleeping Beauty",
    Flora: "Sleeping Beauty",
    Fauna: "Sleeping Beauty",
    Merryweather: "Sleeping Beauty",

    // The Princess and the Frog
    Tiana: "The Princess and the Frog",
    Prince_Naveen: "The Princess and the Frog",
    Dr_Facilier: "The Princess and the Frog",
    Mama_Odie: "The Princess and the Frog",
    Louis: "The Princess and the Frog",

    // Tangled
    Rapunzel: "Tangled",
    Flynn_Rider: "Tangled",
    Mother_Gothel: "Tangled",
    Pascal: "Tangled",
    Maximus: "Tangled",

    // Aladdin
    Aladdin: "Aladdin",
    Jasmine: "Aladdin",
    Genie: "Aladdin",
    Jafar: "Aladdin",
    Iago: "Aladdin",
    Sultan: "Aladdin",

    // Hercules
    Hercules: "Hercules",
    Hades: "Hercules",
    Megara: "Hercules",
    Phil: "Hercules",
    Zeus: "Hercules",
    Pain: "Hercules",
    Panic: "Hercules",

    // The Lion King
    Simba: "The Lion King",
    Nala: "The Lion King",
    Mufasa: "The Lion King",
    Scar: "The Lion King",
    Timon: "The Lion King",
    Pumbaa: "The Lion King",
    Rafiki: "The Lion King",
    Zazu: "The Lion King",

    // Mulan
    Mulan: "Mulan",
    Li_Shuang: "Mulan",
    Mushu: "Mulan",
    Shan_Yu: "Mulan",

    // Peter Pan
    Peter_Pan: "Peter Pan",
    Wendy: "Peter Pan",
    Captain_Hook: "Peter Pan",
    Tinker_Bell: "Peter Pan",
    Mr_Smee: "Peter Pan",

    // Lilo & Stitch
    Stitch: "Lilo & Stitch",
    Lilo: "Lilo & Stitch",
    Nani: "Lilo & Stitch",
    Jumba: "Lilo & Stitch",
    Pleakley: "Lilo & Stitch",
    Dr_Hämsterviel: "Lilo & Stitch",
    Captain_Gantu: "Lilo & Stitch",
    Angel: "Lilo & Stitch",

    // Moana
    Moana: "Moana",
    Maui: "Moana",
    Gramma_Tala: "Moana",
    Chief_Tui: "Moana",
    Te_Ka: "Moana",
    Tamatoa: "Moana",

    // Frozen
    Elsa: "Frozen",
    Anna: "Frozen",
    Kristoff: "Frozen",
    Olaf: "Frozen",
    Hans: "Frozen",
    Marshmallow: "Frozen",

    // 101 Dalmatians
    Pongo: "101 Dalmatians",
    Perdita: "101 Dalmatians",
    Cruella_De_Vil: "101 Dalmatians",

    // Winnie the Pooh
    Winnie_the_Pooh: "Winnie the Pooh",
    Piglet: "Winnie the Pooh",
    Tigger: "Winnie the Pooh",
    Eeyore: "Winnie the Pooh",
    Rabbit: "Winnie the Pooh",
    Owl: "Winnie the Pooh",

    // Alice in Wonderland
    Alice: "Alice in Wonderland",
    Mad_Hatter: "Alice in Wonderland",
    Queen_of_Hearts: "Alice in Wonderland",
    Cheshire_Cat: "Alice in Wonderland",
  };

  // Try exact match first
  if (FRANCHISE_MAP[name]) {
    return FRANCHISE_MAP[name];
  }

  // Try with spaces replaced by underscores
  const underscoreName = name.replace(/\s+/g, "_");
  if (FRANCHISE_MAP[underscoreName]) {
    return FRANCHISE_MAP[underscoreName];
  }

  // Default to "General" for unknown cards
  console.warn(`Could not infer franchise for: ${name}`);
  return "General";
}

/**
 * Generate Ravensburger ID from legacy card
 * This is a placeholder - actual implementation may use hashing
 */
function generateRavensburgerId(_legacyCard: LegacyCard): string {
  // TODO: Implement proper Ravensburger ID generation
  // For now, return empty string to indicate it's missing
  return "";
}
