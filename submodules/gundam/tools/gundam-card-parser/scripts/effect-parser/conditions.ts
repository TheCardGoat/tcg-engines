import type { CardColor, EffectCondition } from "@tcg/gundam-types";
import { parseCardType, parseKeywordEffectName } from "./helpers.ts";

/**
 * Parse a condition text into a typed EffectCondition.
 * Returns undefined for unrecognised patterns.
 */
export function parseCondition(text: string): EffectCondition | undefined {
  const t = text.trim().toLowerCase();

  if (/^this Unit is rested$/i.test(text.trim())) return { type: "selfIsRested" };

  if (/you have no (?:remaining )?ex resources?/i.test(text)) {
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "resourceArea",
      cardType: "resource",
      hasName: "EX Resource",
      comparison: "eq",
      count: 0,
    };
  }

  if (/your opponent has an EX Resource/i.test(text)) {
    return {
      type: "cardInZone",
      owner: "opponent",
      zone: "resourceArea",
      cardType: "resource",
      hasName: "EX Resource",
      comparison: "gte",
      count: 1,
    };
  }

  const restedUnitsInPlayM = text.match(/(\d+) or more rested Units? are in play/i);
  if (restedUnitsInPlayM)
    return {
      type: "unitCount",
      owner: "any",
      comparison: "gte",
      count: Number.parseInt(restedUnitsInPlayM[1], 10),
      state: "rested",
    };

  const otherRestedUnitsInPlayM = text.match(
    /(\d+) or more other rested (?:friendly )?Units? (?:are )?in play/i,
  );
  if (otherRestedUnitsInPlayM)
    return {
      type: "unitCount",
      owner: /friendly/i.test(otherRestedUnitsInPlayM[0]) ? "friendly" : "any",
      comparison: "gte",
      count: Number.parseInt(otherRestedUnitsInPlayM[1], 10),
      state: "rested",
      excludeSelf: true,
    };

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

  if (t.match(/\bthis(?: unit)? is damaged\b/)) return { type: "selfIsDamaged" };
  if (/this is a Link Unit/i.test(text)) return { type: "duringLink" };
  if (/this Unit is attacking an enemy Unit/i.test(text)) return { type: "isAttackingUnit" };
  if (/it is attacking an enemy Unit/i.test(text)) return { type: "isAttackingUnit" };
  if (/you are attacking an enemy Unit/i.test(text)) return { type: "isAttackingUnit" };
  if (/you are attacking the enemy player/i.test(text)) return { type: "isAttackingPlayer" };
  if (/this Unit is attacking the enemy player/i.test(text)) return { type: "isAttackingPlayer" };
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
  const selfStatExactM = text.match(/this Unit has (?:exactly )?(\d+) (AP|HP)/i);
  if (selfStatExactM)
    return {
      type: "selfStat",
      stat: selfStatExactM[2].toLowerCase() as "ap" | "hp",
      comparison: "eq",
      value: parseInt(selfStatExactM[1]),
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
  const linkedColorM = text.match(/this is a (blue|green|red|white|purple) Unit/i);
  if (linkedColorM)
    return {
      type: "linkedUnitHasColor",
      color: linkedColorM[1].toLowerCase() as CardColor,
    };

  // selfHasTrait: "while this Unit is (Zeon)"
  const selfTraitM = text.match(/this Unit is \(([^)]+)\)/i);
  if (selfTraitM) return { type: "selfHasTrait", trait: selfTraitM[1].toLowerCase() };

  // Paired Pilot wording: "this is a/an (CB) Unit"
  const pairedHostTraitM = text.match(/this is an? \(([^)]+)\) Unit/i);
  if (pairedHostTraitM) return { type: "selfHasTrait", trait: pairedHostTraitM[1].toLowerCase() };

  // isTurn: "if it is your turn" / "during your turn"
  if (t.match(/\bit is your turn\b/) || t.match(/\bduring your turn\b/))
    return { type: "isTurn", whose: "friendly" };
  if (t.match(/\bit is your opponent'?s? turn\b/)) return { type: "isTurn", whose: "opponent" };

  // handCount: "if your opponent has N or more cards in their hand"
  const oppHandM = text.match(
    /(?:your opponent|an enemy player) has (\d+) or more cards? in their hand/i,
  );
  if (oppHandM)
    return {
      type: "handCount",
      owner: "opponent",
      comparison: "gte",
      count: parseInt(oppHandM[1]),
    };

  const friendlyHandM = text.match(
    /you have (\d+) or (more|higher|less|fewer) cards? in your hand/i,
  );
  if (friendlyHandM)
    return {
      type: "handCount",
      owner: "friendly",
      comparison: /more|higher/i.test(friendlyHandM[2]) ? "gte" : "lte",
      count: parseInt(friendlyHandM[1]),
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

  const anotherKeywordUnitM = text.match(/you have another Unit with <([\w\s-]+)> in play/i);
  if (anotherKeywordUnitM) {
    const keyword = parseKeywordEffectName(anotherKeywordUnitM[1]);
    if (keyword)
      return {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        excludeSelf: true,
        hasKeyword: keyword,
      };
  }

  if (/you have a Link Unit in play/i.test(text)) {
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      isLinkUnit: true,
    };
  }

  const friendlyTraitLinkM = text.match(/a friendly \(([^)]+)\) Link Unit is in play/i);
  if (friendlyTraitLinkM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      hasTrait: friendlyTraitLinkM[1].toLowerCase(),
      isLinkUnit: true,
    };

  const anotherFriendlyTraitLinkM = text.match(
    /another friendly \(([^)]+)\) Link Unit is in play/i,
  );
  if (anotherFriendlyTraitLinkM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      excludeSelf: true,
      hasTrait: anotherFriendlyTraitLinkM[1].toLowerCase(),
      isLinkUnit: true,
    };

  const friendlyTraitCountM = text.match(/(\d+) or more friendly \(([^)]+)\) Units? are in play/i);
  if (friendlyTraitCountM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: Number.parseInt(friendlyTraitCountM[1], 10),
      hasTrait: friendlyTraitCountM[2].toLowerCase(),
    };

  const friendlyKeywordUnitM = text.match(/a friendly Unit with <([\w\s-]+)> is in play/i);
  if (friendlyKeywordUnitM) {
    const keyword = parseKeywordEffectName(friendlyKeywordUnitM[1]);
    if (keyword)
      return {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        hasKeyword: keyword,
      };
  }

  const friendlyTraitKeywordUnitM = text.match(
    /a friendly \(([^)]+)\) Unit with <([\w\s-]+)> is in play/i,
  );
  if (friendlyTraitKeywordUnitM) {
    const keyword = parseKeywordEffectName(friendlyTraitKeywordUnitM[2]);
    if (keyword)
      return {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        hasTrait: friendlyTraitKeywordUnitM[1].toLowerCase(),
        hasKeyword: keyword,
      };
  }

  const anotherTraitOrM = text.match(/another ((?:\([^)]+\)\/)+\([^)]+\)) Unit in play/i);
  if (anotherTraitOrM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      excludeSelf: true,
      hasTrait: Array.from(anotherTraitOrM[1].matchAll(/\(([^)]+)\)/g)).map((m) =>
        m[1].toLowerCase(),
      ),
    };

  const hasTraitLinkM = text.match(/you have an? \(([^)]+)\) Link Unit in play/i);
  if (hasTraitLinkM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      hasTrait: hasTraitLinkM[1].toLowerCase(),
      isLinkUnit: true,
    };

  const restedFriendlyTraitM = text.match(/a rested friendly \(([^)]+)\) Unit is in play/i);
  if (restedFriendlyTraitM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      hasTrait: restedFriendlyTraitM[1].toLowerCase(),
      state: "rested",
    };

  const youHaveRestedTraitM = text.match(/you have a rested \(([^)]+)\) Unit in play/i);
  if (youHaveRestedTraitM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      hasTrait: youHaveRestedTraitM[1].toLowerCase(),
      state: "rested",
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

  const anotherFriendlyTraitM = text.match(/another friendly (?:\(([^)]+)\) )?Unit is in play/i);
  if (anotherFriendlyTraitM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      excludeSelf: true,
      ...(anotherFriendlyTraitM[1] ? { hasTrait: anotherFriendlyTraitM[1].toLowerCase() } : {}),
    };

  // unitCount - there are N or more rested Units in play (all players)
  // Unlike "you have", this wording counts units on both sides of the battlefield.
  const totalRestedUnitsM = text.match(/there are (\d+) or more rested Units? in play/i);
  if (totalRestedUnitsM)
    return {
      type: "unitCount",
      owner: "any",
      comparison: "gte",
      count: parseInt(totalRestedUnitsM[1]),
      state: "rested",
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
  const unitCountM = text.match(/you have (\d+) or more (other )?(?:\(([^)]+)\) )?Units? in play/i);
  if (unitCountM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: parseInt(unitCountM[1]),
      ...(unitCountM[2] ? { excludeSelf: true } : {}),
      ...(unitCountM[3] ? { hasTrait: unitCountM[3].toLowerCase() } : {}),
    };

  // unitCount - no optional-trait Unit tokens in play
  const noUnitTokensM = text.match(/you have no (?:\(([^)]+)\) )?Unit tokens? in play/i);
  if (noUnitTokensM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "eq",
      count: 0,
      ...(noUnitTokensM[1] ? { hasTrait: noUnitTokensM[1].toLowerCase() } : {}),
      isToken: true,
    };

  if (/you have (?:a )?Unit token in play/i.test(text))
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      isToken: true,
    };

  // unitCount - you have no Units / only N Units / N Units in play
  if (/you have no Units? in play/i.test(text))
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "eq",
      count: 0,
    };

  const noHighLevelUnitsM = text.match(
    /you have no Units that are Lv\.?\s*(\d+) or higher in play/i,
  );
  if (noHighLevelUnitsM)
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "battleArea",
      cardType: "unit",
      comparison: "eq",
      count: 0,
      attributeFilters: [
        {
          attribute: "level",
          comparison: "gte",
          value: parseInt(noHighLevelUnitsM[1]),
        },
      ],
    };

  // cardInZone - a friendly named Unit at or above a level threshold in play.
  // This is deliberately a cardInZone condition rather than unitCount because
  // the printed name predicate and level predicate must both match the same Unit.
  const friendlyNamedHighLevelUnitM = text.match(
    /you have (?:a|an|\d+) Unit with "([^"]+)" in its card name that is Lv\.?\s*(\d+) or higher in play/i,
  );
  if (friendlyNamedHighLevelUnitM)
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "battleArea",
      cardType: "unit",
      comparison: "gte",
      count: 1,
      attributeFilters: [
        { attribute: "name", comparison: "includes", value: friendlyNamedHighLevelUnitM[1] },
        {
          attribute: "level",
          comparison: "gte",
          value: Number.parseInt(friendlyNamedHighLevelUnitM[2], 10),
        },
      ],
    };

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

  // enemy unitCount - a bounded range of enemy Units is in play
  const enemyUnitRangeM = text.match(/(\d+) to (\d+) enemy Units? are in play/i);
  if (enemyUnitRangeM)
    return {
      type: "and",
      conditions: [
        {
          type: "unitCount",
          owner: "opponent",
          comparison: "gte",
          count: parseInt(enemyUnitRangeM[1]),
        },
        {
          type: "unitCount",
          owner: "opponent",
          comparison: "lte",
          count: parseInt(enemyUnitRangeM[2]),
        },
      ],
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

  const enemyTraitUnitM = text.match(/an enemy \(([^)]+)\) Unit is in play/i);
  if (enemyTraitUnitM)
    return {
      type: "cardInZone",
      owner: "opponent",
      zone: "battleArea",
      cardType: "unit",
      comparison: "gte",
      count: 1,
      hasTrait: enemyTraitUnitM[1].toLowerCase(),
    };

  if (/a rested enemy Unit is in play/i.test(text))
    return {
      type: "unitCount",
      owner: "opponent",
      comparison: "gte",
      count: 1,
      state: "rested",
    };

  const enemyShieldM = text.match(/there are (\d+) or less enemy Shields?/i);
  if (enemyShieldM)
    return {
      // Shield counts are represented by the runtime as cards in the
      // opponent's Shield Area, which also gives the condition a uniform
      // zone/count shape with other catalog predicates.
      type: "cardInZone",
      owner: "opponent",
      zone: "shieldArea",
      comparison: "lte",
      count: Number.parseInt(enemyShieldM[1], 10),
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

  // cardInZone - there are N or more (Trait) cards in your trash
  const trashTraitM = text.match(
    /there are (\d+) or more \(([^)]+)\)(?:\s+([\w ]+?))? cards? in your trash/i,
  );
  if (trashTraitM) {
    const ct = trashTraitM[3] ? parseCardType(trashTraitM[3]) : undefined;
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "trash",
      ...(ct ? { cardType: ct } : {}),
      comparison: "gte",
      count: parseInt(trashTraitM[1]),
      hasTrait: trashTraitM[2].toLowerCase(),
    };
  }

  // cardInZone - there are N or more Command/... cards in your trash
  const trashAnyM = text.match(/there are (\d+) or more cards? in your trash/i);
  if (trashAnyM) {
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "trash",
      comparison: "gte",
      count: parseInt(trashAnyM[1]),
    };
  }

  const trashM = text.match(/there are (\d+) or more ([\w ]+?) cards? in your trash/i);
  if (trashM) {
    const ct = parseCardType(trashM[2]);
    const color = ["blue", "green", "red", "white", "purple"].includes(
      trashM[2].trim().toLowerCase(),
    )
      ? (trashM[2].trim().toLowerCase() as CardColor)
      : undefined;
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "trash",
      ...(ct ? { cardType: ct } : {}),
      comparison: "gte",
      count: parseInt(trashM[1]),
      ...(color ? { hasColor: color } : {}),
    };
  }

  if (/a friendly Base (?:is )?in play/i.test(text)) return { type: "friendlyBaseInPlay" };

  const deployedFromM = text.match(/you deploy this Unit from your (trash|hand)/i);
  if (deployedFromM)
    return {
      type: "deployedFromZone",
      zone: deployedFromM[1].toLowerCase() as "trash" | "hand",
    };

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

  // cardInZone - a friendly Unit with a printed name fragment is in play
  const inPlayNameM = text.match(
    /you have a (?:friendly )?Unit with "([^"]+)" in its card name in play/i,
  );
  if (inPlayNameM) {
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "battleArea",
      cardType: "unit",
      comparison: "gte",
      count: 1,
      hasName: inPlayNameM[1],
    };
  }

  if (/no enemy Base is in play/i.test(text))
    return {
      type: "cardInZone",
      owner: "opponent",
      zone: "baseSection",
      cardType: "base",
      comparison: "eq",
      count: 0,
    };

  // friendlyBaseInPlay: "if a friendly white Base is in play" /
  // "while there is a friendly white Base in play"
  const baseM = text.match(/(?:there is )?a friendly (\w+)? ?Base (?:is )?in play/i);
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
  const friendlyTraitUnitM = text.match(/a friendly \(([^)]+)\) Unit is in play/i);
  if (friendlyTraitUnitM)
    return {
      type: "unitCount",
      owner: "friendly",
      comparison: "gte",
      count: 1,
      hasTrait: friendlyTraitUnitM[1].toLowerCase(),
    };

  const coloredTraitCardInPlayM = text.match(
    /you have (?:an? )?(blue|green|red|white|purple) \(([^)]+)\) ([\w ]+?) in play/i,
  );
  if (coloredTraitCardInPlayM) {
    const ct = parseCardType(coloredTraitCardInPlayM[3]);
    if (ct)
      return {
        type: "cardInZone",
        owner: "friendly",
        zone: "battleArea",
        cardType: ct,
        hasTrait: coloredTraitCardInPlayM[2].toLowerCase(),
        hasColor: coloredTraitCardInPlayM[1].toLowerCase() as CardColor,
        comparison: "gte",
        count: 1,
      };
  }

  const nonColorTraitPilotInPlayM = text.match(
    /you have (?:an? )?non-(blue|green|red|white|purple) \(([^)]+)\) Pilot in play/i,
  );
  if (nonColorTraitPilotInPlayM) {
    return {
      type: "cardInZone",
      owner: "friendly",
      zone: "battleArea",
      cardType: "pilot",
      hasTrait: nonColorTraitPilotInPlayM[2].toLowerCase(),
      attributeFilters: [
        {
          attribute: "color",
          comparison: "neq",
          value: nonColorTraitPilotInPlayM[1].toLowerCase() as CardColor,
        },
      ],
      comparison: "gte",
      count: 1,
    };
  }

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
