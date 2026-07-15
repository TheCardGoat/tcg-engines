import type { CardColor, EffectCondition } from "@tcg/gundam-types";
import { parseCardType, parseKeywordEffectName } from "./helpers.ts";

/**
 * Parse a condition text into a typed EffectCondition.
 * Returns undefined for unrecognised patterns.
 */
export function parseCondition(text: string): EffectCondition | undefined {
  const t = text.trim().toLowerCase();

  // ── Compound: "A and B" ──────────────────────────────────────────────────
  // Checked FIRST so that compound conditions like "this Unit has 5+ AP and it is
  // attacking" aren't short-circuited by a simple pattern matching a sub-clause.
  // Falls through to simple matching if not all parts resolve.
  const andParts = text.split(/\s+and\s+/i);
  if (andParts.length > 1) {
    const resolved: EffectCondition[] = [];
    for (const part of andParts) {
      const c = parseCondition(part.trim());
      if (c) resolved.push(c);
    }
    if (resolved.length === andParts.length) {
      return { type: "and", conditions: resolved };
    }
    // Some parts unresolvable — fall through to simple matching below
  }

  if (t.match(/\bthis unit is damaged\b/)) return { type: "selfIsDamaged" };
  if (t.match(/\bit is attacking\b/) || t.match(/\bthis unit is attacking\b/))
    return { type: "selfIsAttacking" };

  // selfStat: "this Unit has N or more/less AP/HP"
  const selfStatHighM = text.match(/this Unit has (\d+) or more (AP|HP)/i);
  if (selfStatHighM)
    return {
      type: "selfStat",
      stat: selfStatHighM[2].toLowerCase() as "ap" | "hp",
      comparison: "gte",
      value: parseInt(selfStatHighM[1]),
    };
  const selfStatLowM = text.match(/this Unit has (\d+) or (?:less|fewer) (AP|HP)/i);
  if (selfStatLowM)
    return {
      type: "selfStat",
      stat: selfStatLowM[2].toLowerCase() as "ap" | "hp",
      comparison: "lte",
      value: parseInt(selfStatLowM[1]),
    };

  // playerLevel: "you are Lv.7 or higher/lower"
  const playerLvHighM = text.match(/you are Lv\.?\s*(\d+) or higher/i);
  if (playerLvHighM)
    return { type: "playerLevel", comparison: "gte", value: parseInt(playerLvHighM[1]) };
  const playerLvLowM = text.match(/you are Lv\.?\s*(\d+) or lower/i);
  if (playerLvLowM)
    return { type: "playerLevel", comparison: "lte", value: parseInt(playerLvLowM[1]) };

  // selfHasKeyword: "if this Unit has <Repair>" / "while this Unit has <Breach>"
  const selfKwM = text.match(/this Unit has <([\w\s-]+?)(?:\s+\d+)?>/i);
  if (selfKwM) {
    const kw = parseKeywordEffectName(selfKwM[1]);
    if (kw) return { type: "selfHasKeyword", keyword: kw };
  }

  // selfIsColor: "while this Unit is blue"
  const colorM = text.match(/this Unit is (blue|green|red|white|purple)/i);
  if (colorM)
    return {
      type: "selfIsColor",
      color: colorM[1].toLowerCase() as CardColor,
    };

  // selfHasTrait: "while this Unit is (Zeon)"
  const selfTraitM = text.match(/this Unit is \(([^)]+)\)/i);
  if (selfTraitM) return { type: "selfHasTrait", trait: selfTraitM[1].toLowerCase() };

  // isTurn: "if it is your turn" / "during your turn"
  if (t.match(/\bit is your turn\b/) || t.match(/\bduring your turn\b/))
    return { type: "isTurn", whose: "friendly" };
  if (t.match(/\bit is your opponent'?s? turn\b/)) return { type: "isTurn", whose: "opponent" };

  // handCount: "if your opponent has N or more cards in their hand"
  const oppHandM = text.match(/your opponent has (\d+) or more cards? in their hand/i);
  if (oppHandM)
    return {
      type: "handCount",
      owner: "opponent",
      comparison: "gte",
      count: parseInt(oppHandM[1]),
    };

  // unitCount - "another Link Unit" (excludes self, no numeric count)
  const anotherLinkM = text.match(/you have another Link Unit in play/i);
  if (anotherLinkM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      excludeSelf: true,
      isLinkUnit: true,
    };

  // unitCount - "another (Trait) Unit" (excludes self)
  const anotherTraitM = text.match(/you have another (?:\(([^)]+)\) )?Unit in play/i);
  if (anotherTraitM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      excludeSelf: true,
      ...(anotherTraitM[1] ? { hasTrait: anotherTraitM[1].toLowerCase() } : {}),
    };

  // unitCount - you have N or more (TraitA)/(TraitB)[/(TraitC)...] Units in play
  // Trait-OR variant must be checked BEFORE the single-trait form below so
  // "(Gjallarhorn)/(Tekkadan)" doesn't get swallowed by a greedy single-paren match.
  const unitCountOrM = text.match(
    /you have (\d+) or more (?:other )?((?:\([^)]+\)\/)+\([^)]+\)) Units? in play/i,
  );
  if (unitCountOrM) {
    const traits = Array.from(unitCountOrM[2].matchAll(/\(([^)]+)\)/g)).map((m) =>
      m[1].toLowerCase(),
    );
    const excludeSelf = /other /i.test(unitCountOrM[0]);
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: parseInt(unitCountOrM[1]),
      hasTrait: traits,
      ...(excludeSelf ? { excludeSelf: true } : {}),
    };
  }

  // unitCount - you have N or more (Trait) Units in play
  const unitCountM = text.match(/you have (\d+) or more (?:\(([^)]+)\) )?Units? in play/i);
  if (unitCountM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: parseInt(unitCountM[1]),
      ...(unitCountM[2] ? { hasTrait: unitCountM[2].toLowerCase() } : {}),
    };

  // unitCount - you have only N / you have 0 Units in play
  const unitExactM = text.match(/you have (?:only )?(\d+) Units? in play/i);
  if (unitExactM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "eq",
      count: parseInt(unitExactM[1]),
    };

  // unitCount - you have 2 or more Units in play (no "only")
  const unitMoreM = text.match(/you have (\d+) or more Units? in play/i);
  if (unitMoreM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: parseInt(unitMoreM[1]),
    };

  // enemy unitCount - N or more enemy Units are in play
  const enemyUnitM = text.match(/(\d+) or more enemy Units? are in play/i);
  if (enemyUnitM)
    return {
      type: "unitCount",
      owner: "opponent",
      comparison: "gte",
      count: parseInt(enemyUnitM[1]),
    };

  // cardInZone - there are N or more (TraitA)/(TraitB)[...] [CardType] cards in your trash
  // Handles "(Zeon)/(Neo Zeon) Unit cards" and "(Teiwaz)/(Tekkadan) cards".
  const trashOrM = text.match(
    /there are (\d+) or more ((?:\([^)]+\)\/)+\([^)]+\))(?:\s+([\w ]+?))? cards? in your trash/i,
  );
  if (trashOrM) {
    const traits = Array.from(trashOrM[2].matchAll(/\(([^)]+)\)/g)).map((m) => m[1].toLowerCase());
    const ct = trashOrM[3] ? parseCardType(trashOrM[3]) : undefined;
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "trash",
      ...(ct ? { cardType: ct } : {}),
      comparison: "gte",
      count: parseInt(trashOrM[1]),
      hasTrait: traits,
    };
  }

  // cardInZone - there are N or more Command/... cards in your trash
  const trashM = text.match(/there are (\d+) or more ([\w ]+?) cards? in your trash/i);
  if (trashM) {
    const ct = parseCardType(trashM[2]);
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "trash",
      ...(ct ? { cardType: ct } : {}),
      comparison: "gte",
      count: parseInt(trashM[1]),
    };
  }

  // cardInZone - a card with "Name" in its card name is in your trash
  const trashNameM = text.match(/a card with "([^"]+)" in its card name is in your trash/i);
  if (trashNameM) {
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "trash",
      comparison: "gte",
      count: 1,
      hasName: trashNameM[1],
    };
  }

  // friendlyBaseInPlay: "if a friendly white Base is in play"
  const baseM = text.match(/a friendly (\w+)? ?Base is in play/i);
  if (baseM) {
    const colorRaw = baseM[1];
    const colors: Record<string, "blue" | "green" | "red" | "white" | "purple"> = {
      blue: "blue",
      green: "green",
      red: "red",
      white: "white",
      purple: "purple",
    };
    return {
      type: "friendlyBaseInPlay",
      ...(colorRaw && colors[colorRaw.toLowerCase()]
        ? { color: colors[colorRaw.toLowerCase()] }
        : {}),
    };
  }

  // unitCount - friendly (Trait) Unit in play
  const traitUnitM = text.match(/you have (?:an? )?\(([^)]+)\) Unit in play/i);
  if (traitUnitM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      hasTrait: traitUnitM[1].toLowerCase(),
    };

  // cardInZone - friendly (Trait) Pilot/Base/etc. in play
  const traitCardInPlayM = text.match(/you have (?:an? )?\(([^)]+)\) ([\w ]+?) in play/i);
  if (traitCardInPlayM) {
    const ct = parseCardType(traitCardInPlayM[2]);
    if (ct)
      return {
        type: "cardInZone",
        owner: "friendly",
        zone: "battleArea",
        cardType: ct,
        comparison: "gte",
        count: 1,
        hasTrait: traitCardInPlayM[1].toLowerCase(),
      };
  }

  return undefined;
}
