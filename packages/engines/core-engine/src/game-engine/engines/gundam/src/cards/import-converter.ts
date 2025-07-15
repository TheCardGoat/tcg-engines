import type {
  CardColor,
  CardRarity,
  CardZones,
  GundamitoCardSet,
  GundamitoCardType,
  Traits,
} from "../../shared-types";
import type {
  GundamitoBaseCard,
  GundamitoCard,
  GundamitoCommandCard,
  GundamitoPilotCard,
  GundamitoResourceCard,
  GundamitoUnitCard,
} from "./definitions/cardTypes";

/**
 * External JSON card representation (as received from external data sources)
 */
export interface ExternalCardData {
  id: string;
  code: string;
  rarity: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  level: string;
  cost: string;
  color: string;
  cardType: string;
  effect: string;
  zone: string;
  trait: string;
  link: string;
  ap: string;
  hp: string;
  sourceTitle: string;
  getIt: string;
  set: {
    id: string;
    name: string;
  };
}

/**
 * Conversion errors for tracking issues during import
 */
export interface ConversionError {
  cardId: string;
  field: string;
  value: any;
  reason: string;
}

/**
 * Result of card conversion
 */
export interface ConversionResult {
  success: GundamitoCard[];
  errors: ConversionError[];
  warnings: string[];
}

/**
 * Converts external card color to internal color type
 */
function convertColor(externalColor: string): CardColor {
  const color = externalColor.toLowerCase();
  switch (color) {
    case "blue":
      return "blue";
    case "white":
      return "white";
    case "green":
      return "green";
    case "red":
      return "red";
    default:
      return "token"; // Default fallback
  }
}

/**
 * Converts external rarity to internal rarity type
 */
function convertRarity(externalRarity: string): CardRarity {
  const rarity = externalRarity
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\+/g, "");
  switch (rarity) {
    case "c":
      return "common";
    case "u":
      return "uncommon";
    case "r":
      return "rare";
    case "sr":
      return "super_rare";
    case "lr":
      return "legendary";
    default:
      return "common"; // Default fallback
  }
}

/**
 * Converts external card type to internal card type
 */
function convertCardType(externalType: string): GundamitoCardType {
  const type = externalType.toLowerCase();
  switch (type) {
    case "unit":
      return "unit";
    case "pilot":
      return "pilot";
    case "command":
      return "command";
    case "base":
      return "base";
    case "resource":
      return "resource";
    default:
      return "unit"; // Default fallback
  }
}

/**
 * Converts external set ID to internal set type
 */
function convertSet(externalSetId: string): GundamitoCardSet {
  const setId = externalSetId.toLowerCase();
  switch (setId) {
    case "st01":
      return "ST01";
    case "st02":
      return "ST02";
    case "st03":
      return "ST03";
    case "st04":
      return "ST04";
    case "st05":
      return "ST05";
    case "st06":
      return "ST06";
    case "gd01":
      return "GD01";
    case "gd02":
      return "GD02";
    default:
      return "ST01"; // Default fallback
  }
}

/**
 * Parses zones from external zone string
 */
function parseZones(zoneString: string): CardZones[] {
  if (!zoneString || zoneString === "-") return [];

  const zones: CardZones[] = [];
  const lowerZone = zoneString.toLowerCase();

  if (lowerZone.includes("space")) {
    zones.push("space");
  }
  if (lowerZone.includes("earth")) {
    zones.push("earth");
  }

  return zones;
}

/**
 * Parses traits from external trait string
 */
function parseTraits(traitString: string): Traits[] {
  if (!traitString || traitString === "-") return [];

  const traits: Traits[] = [];
  const cleanTraits = traitString
    .replace(/[()]/g, "")
    .split(/\s+/)
    .map((t) => t.toLowerCase())
    .filter((t) => t.length > 0);

  const traitMap: Record<string, Traits> = {
    earth: "earth Federation",
    federation: "earth federation",
    stronghold: "stronghold",
    white: "white base team",
    base: "white base team",
    team: "white base team",
    alliance: "earth alliance",
    operation: "operation meteor",
    meteor: "operation meteor",
    newtype: "newtype",
    academy: "academy",
    civilian: "civilian",
    zeon: "zeon",
    neo: "neo zeon",
    maganac: "maganac corps",
    corps: "maganac corps",
    warship: "warship",
  };

  for (const trait of cleanTraits) {
    if (traitMap[trait] && !traits.includes(traitMap[trait])) {
      traits.push(traitMap[trait]);
    }
  }

  return traits;
}

/**
 * Parses link requirements from external link string
 */
function parseLinkRequirement(linkString: string): string[] {
  if (!linkString || linkString === "-") return [];

  // Extract text between square brackets
  const matches = linkString.match(/\[([^\]]+)\]/g);
  if (!matches) return [];

  return matches.map((match) => match.replace(/[[\]]/g, ""));
}

/**
 * Extracts card number from ID
 */
function extractCardNumber(id: string): number {
  const match = id.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 1;
}

/**
 * Converts a single external card to internal representation
 */
function convertSingleCard(
  external: ExternalCardData,
  errors: ConversionError[],
): GundamitoCard | null {
  try {
    const cardType = convertCardType(external.cardType);
    const color = convertColor(external.color);
    const rarity = convertRarity(external.rarity);
    const set = convertSet(external.set?.id || "st01");

    const baseCard = {
      id: external.id,
      implemented: false,
      missingTestCase: true,
      cost: Number.parseInt(external.cost, 10) || 0,
      level: Number.parseInt(external.level, 10) || 1,
      number: extractCardNumber(external.id),
      name: external.name,
      color,
      set,
      rarity,
    };

    switch (cardType) {
      case "unit": {
        const zones = parseZones(external.zone);
        const traits = parseTraits(external.trait);
        const linkRequirement = parseLinkRequirement(external.link);

        return {
          ...baseCard,
          type: "unit",
          zones,
          traits,
          linkRequirement,
          ap: Number.parseInt(external.ap, 10) || 0,
          hp: Number.parseInt(external.hp, 10) || 1,
        } as GundamitoUnitCard;
      }

      case "pilot": {
        const traits = parseTraits(external.trait);
        const apModifier = external.ap.startsWith("+")
          ? Number.parseInt(external.ap.replace("+", ""), 10) || 0
          : Number.parseInt(external.ap, 10) || 0;
        const hpModifier = external.hp.startsWith("+")
          ? Number.parseInt(external.hp.replace("+", ""), 10) || 0
          : Number.parseInt(external.hp, 10) || 0;

        return {
          ...baseCard,
          type: "pilot",
          traits,
          apModifier,
          hpModifier,
        } as GundamitoPilotCard;
      }

      case "command": {
        // Check if this is a pilot command card by looking for pilot info in effect
        const isPilotCommand = external.effect.includes("【Pilot】");

        if (isPilotCommand) {
          const pilotMatch = external.effect.match(/【Pilot】\[([^\]]+)\]/);
          const pilotName = pilotMatch ? pilotMatch[1] : "";
          const traits = parseTraits(external.trait);
          const apModifier = external.ap.startsWith("+")
            ? Number.parseInt(external.ap.replace("+", ""), 10) || 0
            : Number.parseInt(external.ap, 10) || 0;
          const hpModifier = external.hp.startsWith("+")
            ? Number.parseInt(external.hp.replace("+", ""), 10) || 0
            : Number.parseInt(external.hp, 10) || 0;

          return {
            ...baseCard,
            type: "command",
            subType: "pilot",
            name: external.name,
            pilotName,
            traits,
            apModifier,
            hpModifier,
          };
        }
        return {
          ...baseCard,
          type: "command",
          name: external.name,
        };
      }

      case "base": {
        const zones = parseZones(external.zone);
        const traits = parseTraits(external.trait);

        return {
          ...baseCard,
          type: "base",
          zones,
          traits,
          abilities: [], // Will be populated when ability system is implemented
          ap: Number.parseInt(external.ap, 10) || 0,
          hp: Number.parseInt(external.hp, 10) || 1,
        } as GundamitoBaseCard;
      }

      case "resource": {
        return {
          id: external.id,
          implemented: false,
          missingTestCase: true,
          number: extractCardNumber(external.id),
          name: external.name,
          type: "resource",
          set,
          rarity,
        } as GundamitoResourceCard;
      }

      default:
        errors.push({
          cardId: external.id,
          field: "cardType",
          value: external.cardType,
          reason: `Unknown card type: ${external.cardType}`,
        });
        return null;
    }
  } catch (error) {
    errors.push({
      cardId: external.id,
      field: "general",
      value: external,
      reason: `Failed to convert card: ${error instanceof Error ? error.message : String(error)}`,
    });
    return null;
  }
}

/**
 * Converts an array of external cards to internal representation
 */
export function convertExternalCards(
  externalCards: ExternalCardData[],
): ConversionResult {
  const success: GundamitoCard[] = [];
  const errors: ConversionError[] = [];
  const warnings: string[] = [];

  for (const externalCard of externalCards) {
    // Skip promotional versions (cards with -p1 suffix) for now
    if (externalCard.id.includes("-p1")) {
      warnings.push(`Skipping promotional version: ${externalCard.id}`);
      continue;
    }

    // Skip token cards for now
    if (externalCard.id.startsWith("T-") || externalCard.id.startsWith("EX")) {
      warnings.push(`Skipping token/special card: ${externalCard.id}`);
      continue;
    }

    const convertedCard = convertSingleCard(externalCard, errors);
    if (convertedCard) {
      success.push(convertedCard);
    }
  }

  return {
    success,
    errors,
    warnings,
  };
}

/**
 * Validates that required fields are present for each card type
 */
export function validateConvertedCards(cards: GundamitoCard[]): string[] {
  const validationErrors: string[] = [];

  for (const card of cards) {
    if (!(card.id && card.name)) {
      validationErrors.push(
        `Card ${card.id || "unknown"} missing required fields: id or name`,
      );
    }

    if (card.type === "unit") {
      const unitCard = card as GundamitoUnitCard;
      if (unitCard.ap < 0 || unitCard.hp < 1) {
        validationErrors.push(`Unit card ${card.id} has invalid AP/HP values`);
      }
    }

    if (card.type === "pilot") {
      const pilotCard = card as GundamitoPilotCard;
      if (
        typeof pilotCard.apModifier !== "number" ||
        typeof pilotCard.hpModifier !== "number"
      ) {
        validationErrors.push(
          `Pilot card ${card.id} has invalid modifier values`,
        );
      }
    }
  }

  return validationErrors;
}

/**
 * Main conversion function that processes external JSON and returns internal cards
 * with full validation and error reporting
 */
export function importCards(
  externalData: ExternalCardData[],
): ConversionResult {
  const result = convertExternalCards(externalData);
  const validationErrors = validateConvertedCards(result.success);

  // Add validation errors to the result
  for (const error of validationErrors) {
    result.errors.push({
      cardId: "validation",
      field: "validation",
      value: null,
      reason: error,
    });
  }

  return result;
}
