import type {
  Action,
  CardEffects,
  Condition,
  Cost,
  EffectBlock,
  PermanentEffect,
  ReplacementEffect,
  TargetFilter,
} from "@tcg/op-types";
import type { RawCost, RawEffectSegment } from "./types.ts";
import { parseKeywords } from "./keywords.ts";
import { parseEffectText } from "./text-parser.ts";
import { parseActions } from "./action-parsers/index.ts";
import { parseConditionText, parseInlineCondition } from "./condition-parser/index.ts";

function parseDeckBuildingRules(effectText: string): NonNullable<CardEffects["deckBuildingRules"]> {
  const rules: NonNullable<CardEffects["deckBuildingRules"]> = [];

  if (
    /(?:^|\s)Under the rules of this game, you may have any number of this card in your deck\./i.test(
      effectText,
    )
  ) {
    rules.push({ rule: "unlimitedCopies" });
  }

  const onlyTrait = /you can only include [[{]([^\]}]+)[\]}] type cards in your deck/i.exec(
    effectText,
  );
  if (onlyTrait)
    rules.push({
      rule: "cannotInclude",
      filters: [{ filter: "trait", value: onlyTrait[1]!, match: "exact", negate: true }],
    });
  const forbiddenCost =
    /you cannot include (Events|cards) with a cost of (\d+) or (more|less) in your deck/i.exec(
      effectText,
    );
  if (forbiddenCost)
    rules.push({
      rule: "cannotInclude",
      filters: [
        ...(forbiddenCost[1]!.toLowerCase() === "events"
          ? [{ filter: "cardCategory" as const, value: "event" as const }]
          : []),
        {
          filter: "cost",
          comparison: forbiddenCost[3]!.toLowerCase() === "more" ? "gte" : "lte",
          value: Number(forbiddenCost[2]),
        },
      ],
    });
  return rules;
}

function leaderTraitNames(conditions: Condition[]): Set<string> {
  const names = new Set<string>();
  const visit = (condition: Condition): void => {
    if (condition.condition === "leaderTrait") {
      names.add(condition.trait);
    } else if (condition.condition === "compound") {
      condition.conditions.forEach(visit);
    }
  };
  conditions.forEach(visit);
  return names;
}

function alignSearchAlternativesWithLeaderTraits(
  actions: Action[],
  conditions: Condition[],
): Action[] {
  const traits = leaderTraitNames(conditions);
  if (traits.size === 0) return actions;

  const alignFilter = (filter: TargetFilter): TargetFilter => {
    if (filter.filter === "name" && traits.has(filter.value)) {
      return { filter: "trait", value: filter.value, match: "exact" };
    }
    if (filter.filter === "anyOf" && "groups" in filter) {
      return { ...filter, groups: filter.groups.map((group) => group.map(alignFilter)) };
    }
    if (filter.filter === "anyOf" || filter.filter === "allOf") {
      return { ...filter, filters: filter.filters.map(alignFilter) };
    }
    return filter;
  };

  return actions.map((action) =>
    action.action === "search" && action.revealFilters
      ? { ...action, revealFilters: action.revealFilters.map(alignFilter) }
      : action,
  );
}

// ── RawCost → Cost mapping ──

function mapRawCost(raw: RawCost): Cost | null {
  switch (raw.type) {
    case "restDon":
      return { cost: "restDon", amount: raw.amount };
    case "giveDon":
      return {
        cost: "giveDon",
        amount: raw.amount,
        ...(raw.recipientFilters && { recipientFilters: raw.recipientFilters }),
      };
    case "returnDon":
      if ("donState" in raw && raw.donState === "attached")
        return {
          cost: "returnDon",
          amount: raw.amount,
          donState: "attached",
          destination: "costAreaRested",
        };
      return "minimumAmount" in raw && raw.minimumAmount !== undefined
        ? { cost: "returnDon", minimumAmount: raw.minimumAmount }
        : {
            cost: "returnDon",
            amount: raw.amount,
            ...(raw.donState && { donState: raw.donState }),
          };
    case "restThisCard":
      return { cost: "restThisCard" };
    case "trashThisCard":
      return { cost: "trashThisCard" };
    case "returnThisToHand":
      return { cost: "returnThisToHand" };
    case "returnThisToDeck":
      return { cost: "returnThisToDeck", position: raw.position };
    case "returnThisAndHandToDeck":
      return {
        cost: "returnThisAndHandToDeck",
        handAmount: raw.handAmount,
        position: raw.position,
      };
    case "koCharacter": {
      const match =
        /K\.O\.\s+(\d+)\s+of\s+your\s+(?:\[([^\]]+)\]\s+type\s+)?Characters?(\s+other\s+than\s+this\s+Character)?/i.exec(
          raw.raw,
        );
      if (!match) return null;
      const filters: TargetFilter[] = [];
      if (match[2]) filters.push({ filter: "trait", value: match[2], match: "exact" });
      if (match[3]) filters.push({ filter: "excludeSelf" });
      return {
        cost: "koCharacter",
        amount: parseInt(match[1]!, 10),
        ...(filters.length > 0 && { filters }),
      };
    }
    case "playCard": {
      const match = /play\s+(\d+)\s+\[([^\]]+)\]\s+from\s+your\s+hand/i.exec(raw.raw);
      if (!match) return null;
      return {
        cost: "playCard",
        amount: parseInt(match[1]!, 10),
        zones: ["hand"],
        filters: [{ filter: "name", value: match[2]! }],
      };
    }
    case "trashCard": {
      const match =
        /trash\s+(\d+)\s+[""\u201c]([^""\u201d]+)[""\u201d]\s+type\s+card\s+from\s+your\s+hand\s+or\s+\d+\s+\[([^\]]+)\]\s+from\s+your\s+hand\s+or\s+field/i.exec(
          raw.raw,
        );
      if (!match) return null;
      return {
        cost: "trashCard",
        amount: parseInt(match[1]!, 10),
        options: [
          {
            zones: ["hand"],
            filters: [{ filter: "trait", value: match[2]!, match: "exact" }],
          },
          {
            zones: ["hand", "stage"],
            filters: [{ filter: "name", value: match[3]! }],
          },
        ],
      };
    }
    case "addCharacterToLife":
      return {
        cost: "addCharacterToLife",
        ...(raw.player && { player: raw.player }),
        amount: raw.amount,
        filters: raw.filters,
        position: raw.position,
        faceUp: raw.faceUp,
      };
    case "trashLife":
      return { cost: "trashLife", amount: raw.amount, position: raw.position };
    case "trashFromDeck":
      return null;
    case "turnLifeFaceUp":
      return {
        cost: "turnLifeFaceUp",
        count: raw.count,
        faceUp: raw.faceUp,
        ...(raw.position && { position: raw.position }),
      };
    case "returnCharacter": {
      const match =
        /return\s+(\d+)\s+(?:of\s+your\s+)?(?:(.*?)\s+)?Characters?(?:\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?)?\s+to\s+(?:the\s+owner[''\u2019]s|your)\s+hand/i.exec(
          raw.raw,
        );
      if (!match) return null;
      const filters: TargetFilter[] = [];
      if (/other\s+than\s+this\s+Character/i.test(raw.raw)) {
        filters.push({ filter: "excludeSelf" });
      }
      const traitMatch = /(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s*$/i.exec(
        match[2]?.trim() ?? "",
      );
      if (traitMatch) {
        filters.push({ filter: "trait", value: traitMatch[1]!, match: "exact" });
      }
      if (match[3]) {
        filters.push({
          filter: "cost",
          comparison:
            match[4]?.toLowerCase() === "less"
              ? "lte"
              : match[4]?.toLowerCase() === "more"
                ? "gte"
                : "eq",
          value: parseInt(match[3], 10),
        });
      }
      return {
        cost: "returnCharacter",
        amount: parseInt(match[1]!, 10),
        ...(filters.length > 0 && { filters }),
      };
    }
    case "returnCharacterToDeck": {
      const match =
        /place\s+(\d+)\s+(?:(of\s+your|of\s+your\s+opponent['\u2019]s)\s+)?(Characters?|Stages?)(\s+other\s+than\s+this\s+Character)?(?:\s+with\s+(?:a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?|(\d+)\s+base\s+power))?\s+at\s+the\s+(top|bottom)\s+of\s+(?:the\s+owner['\u2019]s|your)\s+deck/i.exec(
          raw.raw,
        );
      if (!match) return null;
      const filters: TargetFilter[] = [];
      if (match[4]) {
        filters.push({ filter: "excludeSelf" });
      }
      if (match[5]) {
        filters.push({
          filter: "cost",
          comparison:
            match[6]?.toLowerCase() === "less"
              ? "lte"
              : match[6]?.toLowerCase() === "more"
                ? "gte"
                : "eq",
          value: parseInt(match[5], 10),
        });
      }
      if (match[7]) {
        filters.push({
          filter: "basePower",
          comparison: "eq",
          value: parseInt(match[7], 10),
        });
      }
      return {
        cost: "returnCharacterToDeck",
        amount: parseInt(match[1]!, 10),
        position: match[8]!.toLowerCase() as "top" | "bottom",
        player: match[2] ? (/opponent/i.test(match[2]) ? "opponent" : "self") : "both",
        ...(/^Stages?$/i.test(match[3]!) && { zones: ["stage" as const] }),
        ...(filters.length > 0 && { filters }),
      };
    }
    case "returnFromTrashToDeck": {
      const match =
        /(?:place|return)\s+(\d+)\s+(.+?)\s+from\s+your\s+trash\s+(?:(?:at|to)\s+the\s+(top|bottom)\s+of\s+your\s+deck|to\s+your\s+deck\s+and\s+shuffle\s+it)/i.exec(
          raw.raw,
        );
      if (!match) return null;
      const filters: TargetFilter[] = [];
      const cardCategory = /^(Character|Event|Stage)\s+cards?$/i.exec(match[2]!.trim());
      if (cardCategory) {
        filters.push({
          filter: "cardCategory",
          value: cardCategory[1]!.toLowerCase() as "character" | "event" | "stage",
        });
      }
      const trait = /^([[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+cards?$/i.exec(
        match[2]!.trim(),
      );
      if (trait) {
        filters.push({
          filter: "trait",
          value: trait[2]!,
          match: "exact",
        });
      }
      const inclusiveTrait = /^cards?\s+with\s+a\s+type\s+including\s+["“]([^"”]+)["”]$/i.exec(
        match[2]!.trim(),
      );
      if (inclusiveTrait) {
        filters.push({ filter: "trait", value: inclusiveTrait[1]!, match: "includes" });
      }
      const namedPower = /^\[([^\]]+)\]\s+with\s+(\d+)\s+power$/i.exec(match[2]!.trim());
      if (namedPower) {
        filters.push(
          { filter: "name", value: namedPower[1]! },
          {
            filter: "power",
            comparison: "eq",
            value: parseInt(namedPower[2]!, 10),
          },
        );
      }
      return {
        cost: "returnTrashToDeck",
        amount: parseInt(match[1]!, 10),
        position: match[3]?.toLowerCase() === "top" ? "top" : "bottom",
        ...(raw.includeSelf && { includeSelf: true }),
        ...(filters.length > 0 && { filters }),
      };
    }
    case "returnHandToDeck":
      return {
        cost: "returnHandToDeck",
        amount: raw.amount,
        position: raw.position,
      };
    case "addLifeToHand":
      return { cost: "addLifeToHand", amount: raw.amount, position: raw.position };
    case "revealFromHand": {
      const match = /reveal\s+(\d+)\s+(.+?)\s+from\s+your\s+hand/i.exec(raw.raw);
      if (!match) return null;
      const description = match[2]!.trim();
      const characterPower = /^Character\s+cards?\s+with\s+(\d+)\s+power$/i.exec(description);
      if (characterPower)
        return {
          cost: "revealFromHand",
          amount: Number(match[1]),
          filters: [
            { filter: "cardCategory", value: "character" },
            { filter: "power", comparison: "eq", value: Number(characterPower[1]) },
          ],
        };
      const categoryMatch = /^(Character|Event|Stage)s?$/i.exec(description);
      const inclusiveTraitMatch = /^cards?\s+with\s+a\s+type\s+including\s+["“]([^"”]+)["”]$/i.exec(
        description,
      );
      const traitMatch = /^(.+?)\s+type\s+cards?$/i.exec(description);
      const filters: TargetFilter[] = [];
      if (categoryMatch) {
        filters.push({
          filter: "cardCategory",
          value: categoryMatch[1]!.toLowerCase() as "character" | "event" | "stage",
        });
      } else if (inclusiveTraitMatch) {
        filters.push({ filter: "trait", value: inclusiveTraitMatch[1]!, match: "includes" });
      } else if (traitMatch) {
        const traits = traitMatch[1]!
          .split(/\s+or\s+/i)
          .map((trait) => trait.replace(/^[[{"\u201c]|[\]}"\u201d]$/g, "").trim());
        filters.push(
          traits.length === 1
            ? { filter: "trait", value: traits[0]!, match: "exact" }
            : {
                filter: "anyOf",
                filters: traits.map((value) => ({ filter: "trait", value, match: "exact" })),
              },
        );
      } else {
        return null;
      }
      return {
        cost: "revealFromHand",
        amount: parseInt(match[1]!, 10),
        filters,
      };
    }
    case "trashFromHand": {
      const qualifiedTraitCardMatch =
        /trash\s+(\d+)\s+(.+?)\s+type\s+(Character|Event|Stage)\s+cards?\s+with\s+(\d+)\s+power(?:\s+or\s+(less|more))?\s+from\s+your\s+hand/i.exec(
          raw.raw,
        );
      if (qualifiedTraitCardMatch) {
        return {
          cost: "trashFromHand",
          amount: parseInt(qualifiedTraitCardMatch[1]!, 10),
          filters: [
            {
              filter: "trait",
              value: qualifiedTraitCardMatch[2]!.replace(/^[[{"“]|[\]}"”]$/g, "").trim(),
              match: "exact",
            },
            {
              filter: "cardCategory",
              value: qualifiedTraitCardMatch[3]!.toLowerCase() as "character" | "event" | "stage",
            },
            {
              filter: "power",
              comparison:
                qualifiedTraitCardMatch[5]?.toLowerCase() === "less"
                  ? "lte"
                  : qualifiedTraitCardMatch[5]?.toLowerCase() === "more"
                    ? "gte"
                    : "eq",
              value: parseInt(qualifiedTraitCardMatch[4]!, 10),
            },
          ],
        };
      }
      const filters: TargetFilter[] = [];
      if (/trash\s+\d+\s+cards?\s+with\s+a\s+\[Trigger\]\s+from\s+your\s+hand/i.test(raw.raw)) {
        filters.push({ filter: "hasTrigger", value: true });
      }
      const categoryMatch =
        /trash\s+\d+\s+(Character|Event|Stage)(?:s?| cards?)(?:\s+with\s+(?:a\s+cost\s+of\s+\d+|\d+\s+power)(?:\s+or\s+(?:less|more))?)?\s+from\s+your\s+hand/i.exec(
          raw.raw,
        );
      if (categoryMatch) {
        filters.push({
          filter: "cardCategory",
          value: categoryMatch[1]!.toLowerCase() as "character" | "event" | "stage",
        });
      }
      const nameMatch = /trash\s+\d+\s+\[([^\]]+)\]\s+from\s+your\s+hand/i.exec(raw.raw);
      if (nameMatch) {
        filters.push({ filter: "name", value: nameMatch[1]! });
      }
      const coloredTraitMatch =
        /trash\s+\d+\s+(red|green|blue|purple|black|yellow)\s+(?:[[{"\u201c])([^\]}"\u201d]+)(?:[\]}"\u201d])\s+type\s+cards?\s+from\s+your\s+hand/i.exec(
          raw.raw,
        );
      if (coloredTraitMatch) {
        filters.push(
          {
            filter: "color",
            value: coloredTraitMatch[1]!.toLowerCase() as
              | "red"
              | "green"
              | "blue"
              | "purple"
              | "black"
              | "yellow",
          },
          {
            filter: "trait",
            value: coloredTraitMatch[2]!,
            match: "exact",
          },
        );
      }
      const inclusiveTraitMatch =
        /trash\s+\d+\s+cards?\s+with\s+a\s+type\s+including\s+[""\u201c]([^""\u201d]+)[""\u201d]\s+from\s+your\s+hand/i.exec(
          raw.raw,
        );
      const traitMatch = coloredTraitMatch
        ? null
        : (inclusiveTraitMatch ??
          /trash\s+\d+\s+(.+?)\s+type\s+cards?\s+from\s+your\s+hand/i.exec(raw.raw));
      if (traitMatch) {
        const traits = traitMatch[1]!
          .split(/\s+or\s+/i)
          .map((trait) => trait.replace(/^[[{"\u201c]|[\]}"\u201d]$/g, "").trim());
        filters.push(
          traits.length === 1
            ? {
                filter: "trait",
                value: traits[0]!,
                match: inclusiveTraitMatch ? "includes" : "exact",
              }
            : {
                filter: "anyOf",
                filters: traits.map((value) => ({
                  filter: "trait",
                  value,
                  match: inclusiveTraitMatch ? "includes" : "exact",
                })),
              },
        );
      }
      const costMatch =
        /trash\s+\d+\s+Character\s+cards?\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?\s+from\s+your\s+hand/i.exec(
          raw.raw,
        );
      if (costMatch) {
        filters.push({
          filter: "cost",
          comparison:
            costMatch[2]?.toLowerCase() === "less"
              ? "lte"
              : costMatch[2]?.toLowerCase() === "more"
                ? "gte"
                : "eq",
          value: parseInt(costMatch[1]!, 10),
        });
      }
      const powerMatch =
        /trash\s+\d+\s+(?:Character|Event|Stage)\s+cards?\s+with\s+(\d+)\s+power(?:\s+or\s+(less|more))?\s+from\s+your\s+hand/i.exec(
          raw.raw,
        );
      if (powerMatch) {
        filters.push({
          filter: "power",
          comparison:
            powerMatch[2]?.toLowerCase() === "less"
              ? "lte"
              : powerMatch[2]?.toLowerCase() === "more"
                ? "gte"
                : "eq",
          value: parseInt(powerMatch[1]!, 10),
        });
      }
      const match =
        /trash\s+(\d+)\s+cards?\s+from\s+your\s+hand/i.exec(raw.raw) ??
        /trash\s+(\d+)\s+cards?\s+with\s+a\s+\[Trigger\]\s+from\s+your\s+hand/i.exec(raw.raw) ??
        /trash\s+(\d+)\s+(?:Character|Event|Stage)(?:s?|\s+cards?)\s+from\s+your\s+hand/i.exec(
          raw.raw,
        ) ??
        /trash\s+(\d+)\s+\[[^\]]+\]\s+from\s+your\s+hand/i.exec(raw.raw) ??
        /trash\s+(\d+)\s+Character\s+cards?\s+with\s+a\s+cost\s+of\s+\d+(?:\s+or\s+(?:less|more))?\s+from\s+your\s+hand/i.exec(
          raw.raw,
        ) ??
        /trash\s+(\d+)\s+(?:Character|Event|Stage)\s+cards?\s+with\s+\d+\s+power(?:\s+or\s+(?:less|more))?\s+from\s+your\s+hand/i.exec(
          raw.raw,
        ) ??
        /trash\s+(\d+)\s+cards?\s+with\s+a\s+type\s+including\s+[""\u201c][^""\u201d]+[""\u201d]\s+from\s+your\s+hand/i.exec(
          raw.raw,
        ) ??
        /trash\s+(\d+)\s+.+?\s+type\s+cards?\s+from\s+your\s+hand/i.exec(raw.raw);
      if (!match) return null;

      return {
        cost: "trashFromHand",
        amount: parseInt(match[1]!, 10),
        ...(filters.length > 0 && { filters }),
      };
    }
    case "trashCharacter": {
      const plainMatch = /trash\s+(\d+)\s+of\s+your\s+Characters?$/i.exec(raw.raw.trim());
      if (plainMatch) {
        return { cost: "trashCharacter", amount: parseInt(plainMatch[1]!, 10) };
      }
      const namedTraitMatch =
        /trash\s+(\d+)\s+of\s+your\s+[[{"\u201c]([^\]}"\u201d]+)[\]}"\u201d]\s+type\s+Characters?(\s+other\s+than\s+this\s+Character)?/i.exec(
          raw.raw,
        );
      if (namedTraitMatch) {
        return {
          cost: "trashCharacter",
          amount: parseInt(namedTraitMatch[1]!, 10),
          filters: [
            ...(namedTraitMatch[3] ? ([{ filter: "excludeSelf" }] as const) : []),
            { filter: "trait", value: namedTraitMatch[2]!, match: "exact" },
          ],
        };
      }
      const traitMatch =
        /^(?:trash\s+)?(and\s+)?(\d+)\s+of\s+your\s+Characters?\s+with\s+a\s+type\s+including\s+["\u201c]([^"\u201d]+)["\u201d]/i.exec(
          raw.raw,
        );
      if (traitMatch) {
        return {
          cost: "trashCharacter",
          amount: parseInt(traitMatch[2]!, 10),
          filters: [
            ...(traitMatch[1] ? ([{ filter: "excludeSelf" }] as const) : []),
            {
              filter: "trait",
              value: traitMatch[3]!,
              match: "includes",
            },
          ],
        };
      }
      const genericMatch = /trash\s+(\d+)\s+of\s+your\s+Characters?/i.exec(raw.raw);
      if (genericMatch) {
        const powerMatch = /with\s+(\d+)\s+power\s+or\s+more/i.exec(raw.raw);
        const excludesSelf = /other\s+than\s+this\s+Character/i.test(raw.raw);
        const filters = [
          ...(excludesSelf ? ([{ filter: "excludeSelf" }] as const) : []),
          ...(powerMatch
            ? ([
                {
                  filter: "power",
                  comparison: "gte",
                  value: parseInt(powerMatch[1]!, 10),
                },
              ] as const)
            : []),
        ];
        return {
          cost: "trashCharacter",
          amount: parseInt(genericMatch[1]!, 10),
          ...(filters.length > 0 && { filters }),
        };
      }
      const match =
        /trash\s+(\d+)\s+of\s+your\s+(red|green|blue|purple|black|yellow)\s+Characters?\s+with\s+(\d+)\s+power\s+or\s+more/i.exec(
          raw.raw,
        );
      if (!match) return null;
      return {
        cost: "trashCharacter",
        amount: parseInt(match[1]!, 10),
        filters: [
          {
            filter: "color",
            value: match[2]!.toLowerCase() as
              | "red"
              | "green"
              | "blue"
              | "purple"
              | "black"
              | "yellow",
          },
          {
            filter: "power",
            comparison: "gte",
            value: parseInt(match[3]!, 10),
          },
        ],
      };
    }
    case "restCards": {
      const numberedMatch = /(?:rest|and)\s+(\d+)\s+of\s+your\s+(.+)/i.exec(raw.raw);
      const ownedNumberedMatch = /rest\s+your\s+(\d+)\s+(Leader|Character|Stage)/i.exec(raw.raw);
      const leaderOrStageMatch =
        /rest\s+your\s+Leader\s+or\s+(?:1\s+of\s+your\s+)?Stage\s+cards?/i.exec(raw.raw);
      const directMatch = /rest\s+your\s+(Leader|Character|Stage)/i.exec(raw.raw);
      if (!numberedMatch && !ownedNumberedMatch && !leaderOrStageMatch && !directMatch) return null;
      const amount = numberedMatch
        ? parseInt(numberedMatch[1]!, 10)
        : ownedNumberedMatch
          ? parseInt(ownedNumberedMatch[1]!, 10)
          : 1;
      const desc = (
        numberedMatch?.[2] ??
        ownedNumberedMatch?.[2] ??
        (leaderOrStageMatch ? "Leader or Stage" : directMatch![1]!)
      )
        .split(":", 1)[0]!
        .split(/,\s+and\s+return\b/i, 1)[0]!
        .trim()
        .replace(/\s+cards?$/i, "");
      const filters: TargetFilter[] = [];
      if (
        numberedMatch?.[0].trim().toLowerCase().startsWith("and") &&
        /\bCharacters?\b/i.test(desc)
      ) {
        filters.push({ filter: "excludeSelf" });
      }

      // Extract trait: "Dressrosa" or {Trait} or [Trait]
      const traitMatch = /[""[{]([^""\]}]+)[""\]}]\s+type/i.exec(desc);
      if (traitMatch) {
        filters.push({ filter: "trait", value: traitMatch[1]!, match: "exact" });
      }

      // A bracketed name without the printed "type" qualifier is a card-name
      // restriction, e.g. "rest 1 of your [Uta] cards".
      const nameMatch = traitMatch ? null : /^\[([^\]]+)\]$/i.exec(desc);
      if (nameMatch) {
        filters.push({ filter: "name", value: nameMatch[1]! });
      }

      // Extract card categories: "Leader or Stage", "Characters", etc.
      const catMap: Record<string, string> = {
        leader: "leader",
        leaders: "leader",
        character: "character",
        characters: "character",
        stage: "stage",
        stages: "stage",
        event: "event",
        events: "event",
      };
      const afterType = traitMatch
        ? desc.slice(traitMatch.index! + traitMatch[0].length).trim()
        : desc;
      const categoryFilters: TargetFilter[] = [];
      const catWords = afterType.split(/\s+or\s+/i);
      for (const word of catWords) {
        const key = /^(Leader|Character|Stage|Event)s?\b/i.exec(word.trim())?.[1]?.toLowerCase();
        if (key && catMap[key]) {
          categoryFilters.push({
            filter: "cardCategory",
            value: catMap[key]! as "leader" | "character" | "event" | "stage" | "don",
          });
        }
      }
      if (categoryFilters.length === 1) {
        filters.push(categoryFilters[0]!);
      } else if (categoryFilters.length > 1) {
        filters.push({
          filter: "anyOf",
          groups: categoryFilters.map((filter) => [filter]),
        });
      }

      const costMatch = /with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?/i.exec(desc);
      if (costMatch) {
        filters.push({
          filter: "cost",
          comparison:
            costMatch[2]?.toLowerCase() === "less"
              ? "lte"
              : costMatch[2]?.toLowerCase() === "more"
                ? "gte"
                : "eq",
          value: parseInt(costMatch[1]!, 10),
        });
      }

      return { cost: "restCards", amount, ...(filters.length > 0 && { filters }) };
    }
    case "modifyLeaderPower":
      return {
        cost: "modifyLeaderPower",
        value: raw.value,
        duration: raw.duration,
        ...(raw.requiresActive && { requiresActive: true }),
      };
    case "unknown":
      return null;
  }
}

function asReplacementAction(actions: Action[]): Action {
  return actions.length === 1 ? actions[0]! : { action: "sequence", actions };
}

function actionAsDependentCost(action: Action): Cost | null {
  if (action.action === "trashFromHand" && typeof action.amount === "number") {
    return {
      cost: "trashFromHand",
      amount: action.amount,
      ...(action.filters?.length && { filters: action.filters }),
    };
  }
  if (
    action.action === "rest" &&
    action.target.zones.length === 1 &&
    action.target.zones[0] === "costArea" &&
    typeof action.target.count.amount === "number"
  ) {
    return { cost: "restDon", amount: action.target.count.amount };
  }
  if (
    action.action === "rest" &&
    action.target.player === "self" &&
    action.target.zones.length === 1 &&
    action.target.zones[0] === "character" &&
    typeof action.target.count.amount === "number"
  ) {
    return {
      cost: "restCards",
      amount: action.target.count.amount,
      filters: [{ filter: "cardCategory", value: "character" }, ...(action.target.filters ?? [])],
    };
  }
  return null;
}

// ── Card effects builder ──

/**
 * Build a complete `CardEffects` object from card effect text.
 *
 * Combines keyword parsing, effect text decomposition, and action parsing
 * into a single pipeline. Only includes `EffectBlock`s where at least one
 * action was successfully parsed.
 */
export function buildCardEffects(effectText: string): CardEffects | undefined {
  if (!effectText) return undefined;
  // Official card text uses angle brackets for attributes, not HTML tags.
  effectText = effectText
    .replace(/[<＜](Slash|Strike|Ranged|Special|Wisdom)[>＞]/gi, "($1)")
    .replace(/^\s*[-−]\s*(?=\[Trigger\])/i, "")
    .replace(/－/g, "-");

  const deckBuildingRules = parseDeckBuildingRules(effectText);
  const keywords = parseKeywords(effectText);
  const parsed = parseEffectText(effectText);

  const effectBlocks: EffectBlock[] = [];
  const permanentEffects: PermanentEffect[] = [];
  const replacementEffects: ReplacementEffect[] = [];
  if (/when your deck is reduced to 0, you win the game instead of losing/i.test(effectText))
    replacementEffects.push({
      replacedEvent: "loseGame",
      replacementAction: { action: "winGame" },
    });

  const segments: RawEffectSegment[] = [
    ...parsed.plainStatements.map((rawActionText) => ({
      triggers: [],
      conditions: [],
      oncePerTurn: false,
      costs: [],
      optional: false,
      rawActionText,
    })),
    ...parsed.segments,
  ];

  for (const [segmentIndex, seg] of segments.entries()) {
    const alternativeRest =
      /^You may rest your \((Slash|Strike|Ranged|Special|Wisdom)\) attribute Leader or (\d+) of your DON!! cards:\s*(.+)$/i.exec(
        seg.rawActionText,
      );
    if (alternativeRest) {
      const actions = parseActions(alternativeRest[3]!);
      if (actions.parsed.length && !actions.unparsed) {
        for (const trigger of seg.triggers)
          effectBlocks.push({
            trigger,
            optional: true,
            alternativeCosts: [
              [
                {
                  cost: "restCards",
                  amount: 1,
                  filters: [
                    { filter: "cardCategory", value: "leader" },
                    {
                      filter: "attribute",
                      value:
                        alternativeRest[1]!.toLowerCase() as import("@tcg/op-types").OPAttribute,
                    },
                  ],
                },
              ],
              [{ cost: "restDon", amount: Number(alternativeRest[2]) }],
            ],
            actions: actions.parsed,
          });
        continue;
      }
    }

    if (
      /^Once\s+per\s+turn,\s+this\s+Character\s+cannot\s+be\s+K\.O\.[’']?d\s+by\s+your\s+opponent['’]s\s+effects\.?$/i.test(
        seg.rawActionText.trim(),
      )
    ) {
      replacementEffects.push({
        replacedEvent: "ko",
        source: "opponentEffect",
        eventFilter: { targetSelf: true },
        replacementAction: { action: "sequence", actions: [] },
        oncePerTurn: true,
        mandatory: true,
      });
      continue;
    }

    // An in-play observer of its controller's Leader, rather than the Leader itself.
    const observedLeaderAttackMatch =
      /^When\s+your\s+(?:Leader\s+with\s+a\s+type\s+including\s+["“]([^"”]+)["”]|["“{]([^"”}]+)["”}]\s+type\s+Leader|Leader\s+with\s+the\s+["“{]([^"”}]+)["”}]\s+type)\s+attacks\s+or\s+is\s+attacked,\s*you\s+may\s+trash\s+(\d+)\s+cards?\s+from\s+your\s+hand\s+to\s+activate\s+this\s+effect\.\s*(.+)$/is.exec(
        seg.rawActionText.trim(),
      );
    if (observedLeaderAttackMatch && seg.triggers.length === 0) {
      const actions = parseActions(observedLeaderAttackMatch[5]!);
      if (actions.unparsed === "" && actions.parsed.length > 0) {
        const trait =
          observedLeaderAttackMatch[1] ??
          observedLeaderAttackMatch[2] ??
          observedLeaderAttackMatch[3]!;
        const shared: Omit<EffectBlock, "trigger" | "eventFilter"> = {
          conditions: [
            ...seg.conditions,
            {
              condition: "leaderTrait",
              trait,
              match: observedLeaderAttackMatch[1] ? "includes" : "exact",
            },
          ],
          costs: [{ cost: "trashFromHand", amount: Number(observedLeaderAttackMatch[4]) }],
          optional: true,
          actions: actions.parsed,
          ...(seg.oncePerTurn && {
            oncePerTurn: true,
            oncePerTurnKey: `shared:onYourAttack|onOpponentAttack:${seg.rawActionText.trim().toLowerCase()}`,
          }),
        };
        effectBlocks.push(
          {
            ...shared,
            trigger: "onYourAttack",
            eventFilter: { filters: [{ filter: "cardCategory", value: "leader" }] },
          },
          {
            ...shared,
            trigger: "onOpponentAttack",
            eventFilter: { targetFilters: [{ filter: "cardCategory", value: "leader" }] },
          },
        );
        continue;
      }
    }

    // "When this Leader attacks or is attacked, <actions>"
    const dualLeaderAttackMatch =
      /^When\s+this\s+Leader\s+attacks\s+or\s+is\s+attacked,\s*(.+)$/is.exec(
        seg.rawActionText.trim(),
      );
    if (dualLeaderAttackMatch && seg.triggers.length === 0) {
      const dualActions = parseActions(dualLeaderAttackMatch[1]!);
      if (dualActions.unparsed === "" && dualActions.parsed.length > 0) {
        effectBlocks.push(
          {
            trigger: "whenAttacking",
            actions: dualActions.parsed,
            ...(seg.oncePerTurn && { oncePerTurn: true }),
          },
          {
            trigger: "onOpponentAttack",
            eventFilter: { targetSelf: true },
            actions: dualActions.parsed,
            ...(seg.oncePerTurn && { oncePerTurn: true }),
          },
        );
        continue;
      }
    }

    // "When a card is trashed from your hand by your "Trait" type card's effect, draw cards equal to the number of cards trashed."
    const handTrashByTraitMatch =
      /^When\s+a\s+card\s+is\s+trashed\s+from\s+your\s+hand\s+by\s+your\s+(?:[[{"\u201c])([^\]}"\u201d]+)(?:[\]}"\u201d])\s+type\s+card[''\u2019]?s\s+effect,\s*draw\s+cards?\s+equal\s+to\s+the\s+number\s+of\s+cards?\s+trashed\.?$/is.exec(
        seg.rawActionText.trim(),
      );
    if (handTrashByTraitMatch && seg.triggers.length === 0) {
      effectBlocks.push({
        trigger: "whenCardsTrashedFromHandByEffect",
        eventFilter: {
          player: "self",
          causedBy: "self",
          sourceFilters: [
            {
              filter: "trait",
              value: handTrashByTraitMatch[1]!,
              match: "exact",
            },
          ],
          minimumAmount: 1,
        },
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 0,
            amountFromTriggerEvent: true,
          },
        ],
      });
      continue;
    }

    const dependentOptionalThenMatch =
      /^(.+?)\.\s*Then,\s*you\s+may\s+(.+?)\.\s*If\s+you\s+do,\s*(.+)$/is.exec(seg.rawActionText);
    if (
      dependentOptionalThenMatch &&
      seg.triggers.length === 1 &&
      !/^rest \d+ of your DON!! cards?$/i.test(dependentOptionalThenMatch[2]!) &&
      !/^trash \d+ cards? from your hand$/i.test(dependentOptionalThenMatch[2]!)
    ) {
      const leadingActions = parseActions(dependentOptionalThenMatch[1]!);
      const dependentCostActions = parseActions(dependentOptionalThenMatch[2]!);
      const dependentActions = parseActions(dependentOptionalThenMatch[3]!);
      const dependentCosts = dependentCostActions.parsed.map(actionAsDependentCost);
      if (
        leadingActions.unparsed === "" &&
        leadingActions.parsed.length > 0 &&
        dependentCostActions.unparsed === "" &&
        dependentCosts.length > 0 &&
        dependentCosts.every((cost) => cost !== null) &&
        dependentActions.unparsed === "" &&
        dependentActions.parsed.length > 0
      ) {
        effectBlocks.push(
          {
            trigger: seg.triggers[0]!,
            ...(seg.conditions.length > 0 && { conditions: seg.conditions }),
            actions: leadingActions.parsed,
            ...(seg.oncePerTurn && { oncePerTurn: true }),
          },
          {
            trigger: seg.triggers[0]!,
            ...(seg.conditions.length > 0 && { conditions: seg.conditions }),
            costs: dependentCosts as Cost[],
            actions: dependentActions.parsed,
            optional: true,
            ...(seg.oncePerTurn && { oncePerTurn: true }),
          },
        );
        continue;
      }
    }

    const conditionalKoInsteadMatch =
      /^Choose\s+(.+?)\s+and\s+K\.O\.\s+it\.\s*If\s+(.+?),\s*choose\s+(.+?)\s+instead\s+of\s+.+$/i.exec(
        seg.rawActionText.trim().replace(/\.+$/, ""),
      );
    if (conditionalKoInsteadMatch && seg.triggers.length === 1) {
      const normalActions = parseActions(`K.O. ${conditionalKoInsteadMatch[1]!}`);
      const upgradedActions = parseActions(`K.O. ${conditionalKoInsteadMatch[3]!}`);
      const upgradeCondition = parseConditionText(conditionalKoInsteadMatch[2]!);
      if (
        normalActions.unparsed === "" &&
        normalActions.parsed.length > 0 &&
        upgradedActions.unparsed === "" &&
        upgradedActions.parsed.length > 0 &&
        upgradeCondition?.condition === "zoneCount" &&
        upgradeCondition.comparison === "gte"
      ) {
        effectBlocks.push(
          {
            trigger: seg.triggers[0]!,
            conditions: [{ ...upgradeCondition, comparison: "lt" }],
            actions: normalActions.parsed,
          },
          {
            trigger: seg.triggers[0]!,
            conditions: [upgradeCondition],
            actions: upgradedActions.parsed,
          },
        );
        continue;
      }
    }

    // The battled Character is an event identity, not a fresh selectable target.
    const battleOpponentKo =
      /^At\s+the\s+end\s+of\s+a\s+battle\s+in\s+which\s+this\s+Character\s+battles\s+your\s+opponent['’]s\s+Character,\s*you\s+may\s+K\.O\.\s+the\s+opponent['’]s\s+Character\s+you\s+battled\s+with\.\s*If\s+you\s+do,\s*(.+)$/is.exec(
        seg.rawActionText,
      );
    if (battleOpponentKo && seg.triggers.length === 0) {
      const following = parseActions(battleOpponentKo[1]!);
      if (!following.unparsed && following.parsed.length > 0) {
        const filters: TargetFilter[] = [{ filter: "cardCategory", value: "character" }];
        effectBlocks.push({
          trigger: "endOfBattle",
          ...(seg.conditions.length > 0 && { conditions: seg.conditions }),
          ...(seg.oncePerTurn && { oncePerTurn: true }),
          optional: true,
          eventFilter: {
            battlePowerCompared: true,
            anyOf: [
              { sourceSelf: true, targetFilters: filters },
              { targetSelf: true, sourceFilters: filters },
            ],
          },
          actions: [
            {
              action: "ko",
              battleOpponent: true,
              target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
              thenActions: following.parsed,
            },
          ],
        });
        continue;
      }
    }

    // A Character that "battles" resolves this automatic effect at battle end.
    const attributeBattleMatch =
      /^When\s+this\s+Character\s+battles\s+[<＜(](Strike|Slash|Special|Wisdom|Ranged)[>＞)]\s+attribute\s+Characters?,\s*(.+)$/i.exec(
        seg.rawActionText,
      );
    if (attributeBattleMatch && seg.triggers.length === 0) {
      const attributes = {
        strike: "strike",
        slash: "slash",
        special: "special",
        wisdom: "wisdom",
        ranged: "ranged",
      } as const;
      const attribute =
        attributes[attributeBattleMatch[1]!.toLowerCase() as keyof typeof attributes];
      const parsed = parseActions(attributeBattleMatch[2]!);
      if (!parsed.unparsed && parsed.parsed.length > 0) {
        const filters: TargetFilter[] = [
          { filter: "cardCategory", value: "character" },
          { filter: "attribute", value: attribute },
        ];
        effectBlocks.push({
          trigger: "endOfBattle",
          eventFilter: {
            battlePowerCompared: true,
            anyOf: [
              { sourceSelf: true, targetFilters: filters },
              { targetSelf: true, sourceFilters: filters },
            ],
          },
          actions: parsed.parsed,
        });
        continue;
      }
    }

    // Extract inline "If <condition>, ..." from the start of action text
    const canBeActivatedTiming =
      /^This\s+effect\s+can\s+be\s+activated\s+when\b/i.test(seg.rawActionText) ||
      /^This\s+effect\s+can\s+be\s+activated\s+at\s+the\s+start\s+of\s+your\s+turn\b/i.test(
        seg.rawActionText,
      );
    let actionText = seg.rawActionText;
    const sourceSelfEffectKo =
      /^When\s+this\s+Character\s+is\s+K\.O\.['’]?d\s+by\s+an?\s+effect,/i.test(actionText);
    const sourceSelfBattleKo =
      /^When\s+this\s+Character\s+battles\s+and\s+K\.O\.\u2019?'?s\s+your\s+opponent[''\u2019]s\s+Character,/i.test(
        actionText,
      );
    const sourceSelfBattleEndMatch =
      /^At\s+the\s+end\s+of\s+a\s+battle\s+in\s+which\s+this\s+Character\s+battles\s+your\s+opponent[''\u2019]s\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?,/i.exec(
        actionText,
      );
    const opponentCharacterKo =
      /^When\s+(?:your\s+opponent['’]s\s+Character|(?:a\s+)?Character\s+on\s+your\s+opponent['’]s\s+field)\s+is\s+K\.O\.['’]?d,/i.test(
        actionText,
      );
    const opponentLifeRemoved =
      /^When\s+a\s+card\s+is\s+removed\s+from\s+your\s+opponent[''\u2019]s\s+Life\s+cards?,/i.test(
        actionText,
      );
    const leavingIncludedTraitMatch =
      /^When\s+your\s+Character\s+with\s+a\s+type\s+including\s+["\u201c]([^"\u201d]+)["\u201d]\s+is\s+removed\s+from\s+the\s+field\s+by\s+(an|your\s+opponent[''\u2019]s)\s+effect,/i.exec(
        actionText,
      );
    const leavingPrefixTraitMatch =
      /^When\s+your\s+["\u201c]([^"\u201d]+)["\u201d]\s+type\s+Character\s+is\s+removed\s+from\s+the\s+field\s+by\s+(an|your\s+opponent[''\u2019]s)\s+effect,/i.exec(
        actionText,
      );
    const unqualifiedLeavingTraitMatch =
      /^(?:This\s+effect\s+can\s+be\s+activated\s+when|When)\s+your\s+["“{]([^"”}]+)["”}]\s+type\s+Character(?:\s+card)?\s+is\s+removed\s+from\s+the\s+field[.,]/i.exec(
        actionText,
      );
    const leavingTraitMatch = leavingIncludedTraitMatch ?? leavingPrefixTraitMatch;
    const leavingEventFilter = unqualifiedLeavingTraitMatch
      ? {
          player: "self" as const,
          filters: [
            { filter: "cardCategory" as const, value: "character" as const },
            {
              filter: "trait" as const,
              value: unqualifiedLeavingTraitMatch[1]!,
              match: "exact" as const,
            },
          ],
        }
      : leavingTraitMatch
        ? {
            player: "self" as const,
            causedBy: /^your\s+opponent/i.test(leavingTraitMatch[2]!)
              ? ("opponent" as const)
              : ("any" as const),
            filters: [
              {
                filter: "trait" as const,
                value: leavingTraitMatch[1]!,
                match: leavingIncludedTraitMatch ? ("includes" as const) : ("exact" as const),
              },
            ],
          }
        : undefined;
    const inlineConditions: Condition[] = [];
    const activationConditions: Condition[] = [];
    if (
      /^This\s+effect\s+can\s+be\s+activated\s+when\s+your\s+opponent['’]s\s+Character\s+attacks\./i.test(
        actionText,
      )
    ) {
      activationConditions.push({
        condition: "triggerEventCard",
        filters: [{ filter: "cardCategory", value: "character" }],
      });
    }
    const replacementEffectConditions: Condition[] = [];

    const replacementNegation =
      /^(.+?\sinstead)\.\s*If\s+there\s+is\s+(?:a\s+)?\[([^\]]+)\]\s+Character,\s+this\s+effect\s+is\s+negated\.?$/is.exec(
        actionText,
      );
    if (replacementNegation) {
      actionText = replacementNegation[1]!;
      const nameFilter = { filter: "name" as const, value: replacementNegation[2]! };
      replacementEffectConditions.push({
        condition: "compound",
        operator: "and",
        conditions: [
          {
            condition: "notHasCard",
            player: "self",
            zone: "character",
            filters: [nameFilter],
          },
          {
            condition: "notHasCard",
            player: "opponent",
            zone: "character",
            filters: [nameFilter],
          },
        ],
      });
    }

    let inlineCond = parseInlineCondition(actionText);
    while (inlineCond) {
      if (canBeActivatedTiming && !/^If\s+/i.test(actionText))
        activationConditions.push(inlineCond.condition);
      else inlineConditions.push(inlineCond.condition);
      if (inlineCond.remainingText === actionText) break;
      actionText = inlineCond.remainingText;
      inlineCond = parseInlineCondition(actionText);
    }

    const optionalPrefixScopesFirstAction = /^you\s+may\s+add\s+up\s+to\b.+?\.\s*Then,/is.test(
      actionText,
    );
    const optional =
      seg.optional ||
      canBeActivatedTiming ||
      (!optionalPrefixScopesFirstAction &&
        !/^you\s+may\s+(?:trash\s+any\s+number\s+of\s+cards|return\s+any\s+number\s+of\s+Characters)\b/i.test(
          actionText,
        ) &&
        /^you\s+may\b/i.test(actionText));
    const dependentCosts: Cost[] = [];
    const selfTrashJoinedAction = /^you\s+may\s+trash\s+this\s+Character\s+and\s+(.+)$/is.exec(
      actionText,
    );
    if (selfTrashJoinedAction && findReplacementConditions(inlineConditions).length === 0) {
      dependentCosts.push({ cost: "trashThisCard" });
      actionText = selfTrashJoinedAction[1]!;
    }
    const ifYouDoMatch = /^(?:you\s+may\s+)?(.+?)\.\s*If\s+you\s+do,\s*(.+)$/is.exec(actionText);
    if (ifYouDoMatch) {
      const leading = parseActions(ifYouDoMatch[1]!);
      const mappedCosts = leading.parsed.map(actionAsDependentCost);
      if (
        leading.unparsed === "" &&
        mappedCosts.length > 0 &&
        mappedCosts.every((cost) => cost !== null)
      ) {
        dependentCosts.push(...(mappedCosts as Cost[]));
        actionText = ifYouDoMatch[2]!;
      }
    }

    // Rules 4-10-1/2: Then does not bypass an unmet preceding If.
    // Parse the full sequence, then apply the leading condition once at its
    // printed boundary below (after any cost before the colon).
    const actionsResult = parseActions(
      optional &&
        !optionalPrefixScopesFirstAction &&
        seg.costs.length === 0 &&
        dependentCosts.length === 0
        ? actionText.replace(/^you\s+may\s+/i, "")
        : actionText,
    );
    const thenSequence =
      inlineConditions.length > 0 ? /^(.+?)\.\s*Then,\s*(.+)$/is.exec(actionText) : null;
    if (actionsResult.unparsed && thenSequence) {
      const first = parseActions(thenSequence[1]!);
      const rest = parseActions(thenSequence[2]!);
      if (!first.unparsed && !rest.unparsed && first.parsed.length && rest.parsed.length) {
        actionsResult.parsed = [...first.parsed, ...rest.parsed];
        actionsResult.unparsed = "";
      }
    }

    const deckTrashPayments = seg.costs.filter(
      (cost): cost is Extract<RawCost, { type: "trashFromDeck" }> => cost.type === "trashFromDeck",
    );
    if (/trash\s+\d+\s+cards?\s+from\s+your\s+opponent['\u2019]s\s+hand/i.test(actionText)) {
      actionsResult.parsed = actionsResult.parsed.map((action) => {
        if (action.action === "trashFromHand" && action.player === "opponent") {
          const { amount, ...actionWithoutAmount } = action;
          return { ...actionWithoutAmount, chosenBy: "self", amount };
        }
        return action;
      });
    }

    // Preserve the continuation classified as shared by the splitter.
    // A failed If in the chosen option also gates that continuation (4-10-2).
    if (seg.choiceItems && seg.choiceItems.length > 0) {
      const parsedOptions = seg.choiceItems.map((item) => {
        const inline = parseInlineCondition(item);
        return {
          predicate: inline?.condition,
          parsed: parseActions(inline?.remainingText ?? item).parsed,
        };
      });
      const postChoiceResult = seg.postChoiceActionText
        ? parseActions(seg.postChoiceActionText)
        : undefined;
      const sharedThen = postChoiceResult?.unparsed === "" ? postChoiceResult.parsed : [];
      const thenDependsOnOption =
        sharedThen.length > 0 && parsedOptions.some((option) => option.predicate);
      const options: Action[][] = [];
      for (const option of parsedOptions) {
        if (option.parsed.length === 0) continue;
        const optionActions = [...option.parsed, ...(thenDependsOnOption ? sharedThen : [])];
        if (option.predicate && optionActions.length > 1) {
          // Evaluate once: an earlier action can change the condition's state.
          options.push([
            { action: "conditional", predicate: option.predicate, whenTrue: optionActions },
          ]);
        } else {
          options.push(
            optionActions.map((action) => {
              if (!option.predicate) return action;
              const condition =
                "condition" in action && action.condition
                  ? {
                      condition: "compound" as const,
                      operator: "and" as const,
                      conditions: [option.predicate, action.condition],
                    }
                  : option.predicate;
              return { ...action, condition };
            }),
          );
        }
      }
      if (options.length > 0) actionsResult.parsed.push({ action: "choice", options });
      if (!thenDependsOnOption) actionsResult.parsed.push(...sharedThen);
    }

    if (actionsResult.parsed.length === 0) continue;

    const costs: Cost[] = [];
    for (const raw of seg.costs) {
      const mapped = mapRawCost(raw);
      if (mapped) costs.push(mapped);
    }
    costs.push(...dependentCosts);

    const postCostConditions = inlineConditions.filter(
      (condition) => condition.condition !== "triggerEvent",
    );
    const blockInlineConditions = inlineConditions.filter(
      (condition) => condition.condition === "triggerEvent",
    );
    // A condition parsed after a printed cost remains post-cost regardless of
    // whether that cost is optional. The player first pays the text before the
    // colon; only the resulting action is conditional.
    // Explicit "can be activated" timing permits activation before the later
    // conditional result is checked (OP11-102 Camie FAQ).
    const hasPostCostCondition =
      costs.length > 0 || deckTrashPayments.length > 0 || canBeActivatedTiming;
    const postCostCondition =
      hasPostCostCondition && postCostConditions.length > 0
        ? postCostConditions.length === 1
          ? postCostConditions[0]!
          : {
              condition: "compound" as const,
              operator: "and" as const,
              conditions: postCostConditions,
            }
        : null;
    if (postCostCondition) {
      if (actionsResult.parsed.length === 1) {
        actionsResult.parsed = actionsResult.parsed.map((action) => ({
          ...action,
          condition:
            "condition" in action && action.condition
              ? {
                  condition: "compound" as const,
                  operator: "and" as const,
                  conditions: [postCostCondition, action.condition],
                }
              : postCostCondition,
        }));
      } else {
        actionsResult.parsed = [
          {
            action: "conditional",
            predicate: postCostCondition,
            whenTrue: actionsResult.parsed,
          },
        ];
      }
    }

    // These actions implement printed payment processing. They must execute
    // before the post-cost gate, including when that gate fails.
    for (const payment of [...deckTrashPayments].reverse()) {
      actionsResult.parsed.unshift({
        action: "trashFromDeck",
        player: "self",
        amount: payment.amount,
      });
    }

    if (
      seg.costs.some(
        (cost) => cost.type === "returnFromTrashToDeck" && /and\s+shuffle\s+it/i.test(cost.raw),
      )
    ) {
      actionsResult.parsed.unshift({ action: "shuffleDeck", player: "self" });
    }

    const allConditions: Condition[] = [
      ...seg.conditions,
      ...activationConditions,
      ...deckTrashPayments.map(
        (payment): Condition => ({
          condition: "zoneCount",
          player: "self",
          zone: "deck",
          comparison: "gte",
          value: payment.amount,
        }),
      ),
      ...blockInlineConditions,
      ...(postCostCondition ? [] : postCostConditions),
      ...replacementEffectConditions,
    ];
    actionsResult.parsed = alignSearchAlternativesWithLeaderTraits(
      actionsResult.parsed,
      allConditions,
    );

    // Check for replacement conditions — build ReplacementEffect
    const replacementConds = findReplacementConditions(allConditions);
    const counterBattleKoReplacement = replacementConds.find(
      (condition): condition is Extract<Condition, { condition: "replacement" }> =>
        condition.condition === "replacement" &&
        condition.event === "ko" &&
        condition.source === "battle" &&
        condition.target !== undefined,
    );
    const counterBattleKoTarget = counterBattleKoReplacement?.target;
    const counterTrashReplacementAction =
      actionsResult.parsed.length === 1 &&
      actionsResult.parsed[0]?.action === "trashFromHand" &&
      actionsResult.parsed[0].player === "self" &&
      actionsResult.parsed[0].amount === 1
        ? actionsResult.parsed[0]
        : null;
    if (
      seg.triggers.length === 1 &&
      seg.triggers[0] === "counter" &&
      counterBattleKoReplacement &&
      counterBattleKoTarget &&
      counterTrashReplacementAction &&
      /during\s+this\s+turn/i.test(seg.rawActionText)
    ) {
      const { count: _count, ...target } = counterBattleKoTarget;
      effectBlocks.push({
        trigger: "counter",
        actions: [
          {
            action: "battleKoReplacement",
            target: { ...target, count: { amount: "all" } },
            duration: "thisTurn",
          },
        ],
      });
      continue;
    }
    if (replacementConds.length > 0 && actionsResult.parsed.length > 0) {
      const nonReplacementConds = allConditions.filter((c) => !replacementConds.includes(c));
      // For compound replacement conditions, create one ReplacementEffect per replaced event
      const compoundConds = allConditions.filter(
        (c): c is Extract<Condition, { condition: "compound" }> =>
          c.condition === "compound" && c.conditions.some((sub) => sub.condition === "replacement"),
      );
      const simpleRepConds = replacementConds.filter((c) => c.condition === "replacement") as Array<
        Extract<Condition, { condition: "replacement" }>
      >;
      const replacementBranchCount =
        simpleRepConds.length +
        compoundConds.reduce(
          (count, compound) =>
            count +
            compound.conditions.filter((condition) => condition.condition === "replacement").length,
          0,
        );
      const replacementOncePerTurnKey =
        seg.oncePerTurn && replacementBranchCount > 1
          ? `printed-replacement-${segmentIndex}`
          : undefined;

      for (const rc of simpleRepConds) {
        replacementEffects.push({
          replacedEvent: mapReplacementEvent(rc.event),
          ...(rc.target && { target: rc.target }),
          ...(rc.source && { source: rc.source }),
          ...(rc.targetSelf && { eventFilter: { targetSelf: true } }),
          replacementAction: asReplacementAction(actionsResult.parsed),
          ...(!optional && { mandatory: true as const }),
          ...(nonReplacementConds.length > 0 && { conditions: nonReplacementConds }),
          ...(seg.oncePerTurn && { oncePerTurn: true }),
          ...(replacementOncePerTurnKey && { oncePerTurnKey: replacementOncePerTurnKey }),
        });
      }
      for (const cc of compoundConds) {
        const repSubs = cc.conditions.filter(
          (c): c is Extract<Condition, { condition: "replacement" }> =>
            c.condition === "replacement",
        );
        const otherConds = [
          ...nonReplacementConds,
          ...cc.conditions.filter((c) => c.condition !== "replacement"),
        ];
        for (const rc of repSubs) {
          replacementEffects.push({
            replacedEvent: mapReplacementEvent(rc.event),
            ...(rc.target && { target: rc.target }),
            ...(rc.source && { source: rc.source }),
            ...(rc.targetSelf && { eventFilter: { targetSelf: true } }),
            replacementAction: asReplacementAction(actionsResult.parsed),
            ...(!optional && { mandatory: true as const }),
            ...(otherConds.length > 0 && { conditions: otherConds }),
            ...(seg.oncePerTurn && { oncePerTurn: true }),
            ...(replacementOncePerTurnKey && { oncePerTurnKey: replacementOncePerTurnKey }),
          });
        }
      }
      continue;
    }

    // Check if an inline condition is a TriggerEventCondition — convert to EffectBlock trigger
    const triggerEventCond = allConditions.find(
      (c): c is Extract<Condition, { condition: "triggerEvent" }> => c.condition === "triggerEvent",
    );
    const remainingConditions = triggerEventCond
      ? allConditions.filter((c) => c !== triggerEventCond)
      : allConditions;

    if (seg.triggers.length === 0 && triggerEventCond) {
      // "When X, Y" pattern → EffectBlock with X as trigger
      effectBlocks.push({
        trigger: triggerEventCond.event,
        ...(triggerEventCond.event === "whenDonReturned" &&
        /When (\d+) or more DON!! cards/i.test(seg.rawActionText)
          ? {
              eventFilter: {
                minimumAmount: Number(
                  /When (\d+) or more DON!! cards/i.exec(seg.rawActionText)![1],
                ),
              },
            }
          : {}),
        ...(triggerEventCond.source && !leavingEventFilter && { source: triggerEventCond.source }),
        ...(/^When\s+your\s+number\s+of\s+Life\s+cards\s+becomes\s+0,/i.test(
          seg.rawActionText.trim(),
        )
          ? { eventFilter: { player: "self" as const, lifeCountAfterRemoval: 0 } }
          : leavingEventFilter
            ? { eventFilter: leavingEventFilter }
            : triggerEventCond.event === "whenBecomesRested"
              ? { eventFilter: { targetSelf: true } }
              : opponentLifeRemoved ||
                  opponentCharacterKo ||
                  (triggerEventCond.event === "whenBlockerActivated" &&
                    /^When\s+your\s+opponent\s+activates/i.test(seg.rawActionText.trim()))
                ? { eventFilter: { player: "opponent" as const } }
                : sourceSelfBattleEndMatch
                  ? {
                      eventFilter: {
                        sourceSelf: true,
                        targetFilters: [
                          {
                            filter: "cost" as const,
                            comparison:
                              sourceSelfBattleEndMatch[2]?.toLowerCase() === "less"
                                ? ("lte" as const)
                                : sourceSelfBattleEndMatch[2]?.toLowerCase() === "more"
                                  ? ("gte" as const)
                                  : ("eq" as const),
                            value: parseInt(sourceSelfBattleEndMatch[1]!, 10),
                          },
                        ],
                      },
                    }
                  : sourceSelfBattleKo
                    ? {
                        eventFilter: {
                          player: "opponent" as const,
                          koCause: "battle" as const,
                          sourceSelf: true,
                        },
                      }
                    : {}),
        ...(sourceSelfEffectKo && { eventFilter: { koCause: "effect" as const } }),
        ...(remainingConditions.length > 0 && { conditions: remainingConditions }),
        ...(costs.length > 0 && { costs }),
        actions: actionsResult.parsed,
        ...(optional && { optional: true }),
        ...(seg.oncePerTurn && { oncePerTurn: true }),
      });
    } else if (seg.triggers.length === 0) {
      const permanentActions = actionsResult.parsed.map((action) => {
        if (action.action === "addActivationCosts") {
          throw new Error("Permanent added activation costs require an ordering contract.");
        }
        if (
          action.action === "modifyPower" &&
          action.target.player === "self" &&
          action.target.zones.length === 1 &&
          action.target.zones[0] === "leader" &&
          action.target.count.amount === 1 &&
          !action.target.count.upTo
        ) {
          return {
            ...action,
            target: { ...action.target, count: { amount: "all" as const } },
          };
        }
        return action;
      });
      permanentEffects.push({
        ...(remainingConditions.length > 0 && { conditions: remainingConditions }),
        actions: permanentActions,
      });
    } else {
      const oncePerTurnKey =
        seg.oncePerTurn && seg.triggers.length > 1
          ? `shared:${seg.triggers.join("|")}:${seg.rawActionText.trim().toLowerCase()}`
          : undefined;
      for (const trigger of seg.triggers) {
        effectBlocks.push({
          trigger,
          ...(trigger === "whenBecomesRested" && { eventFilter: { targetSelf: true } }),
          ...(remainingConditions.length > 0 && { conditions: remainingConditions }),
          ...(costs.length > 0 && { costs }),
          actions: actionsResult.parsed,
          ...(optional && { optional: true }),
          ...(seg.oncePerTurn && { oncePerTurn: true }),
          ...(oncePerTurnKey && { oncePerTurnKey }),
        });
      }
    }
  }

  if (
    deckBuildingRules.length === 0 &&
    keywords.length === 0 &&
    effectBlocks.length === 0 &&
    permanentEffects.length === 0 &&
    replacementEffects.length === 0
  ) {
    return undefined;
  }

  // Stage-to-deck payments remain leading executable actions until the shared
  // cost schema can express them. Named hand plays are typed playCard costs
  // and must not also be emitted as duplicate actions.
  const leadingActionPayment = /You may (place 1 of your Stages at the bottom of your deck):/i.exec(
    effectText,
  )?.[1];
  if (leadingActionPayment && effectBlocks[0]) {
    const paymentActions = parseActions(leadingActionPayment).parsed;
    effectBlocks[0].actions.unshift(...paymentActions);
  }

  const firstBlock = effectBlocks[0];
  if (
    firstBlock &&
    /trash any number of \[([^\]]+)\] type cards from your hand/i.test(effectText)
  ) {
    const trait = /trash any number of \[([^\]]+)\]/i.exec(effectText)?.[1] ?? "";
    firstBlock.actions = [
      {
        action: "trashFromHand",
        player: "self",
        amount: "all",
        upTo: true,
        filters: [{ filter: "trait", value: trait, match: "exact" }],
      },
      {
        action: "modifyPower",
        target: { player: "self", zones: ["leader", "character"], count: { amount: 1 } },
        value: 0,
        valuePerPreviousActionTarget: 1000,
        duration: "thisBattle",
      },
    ];
  }
  if (firstBlock && /trash 1 of your Characters with 6000 power or more/i.test(effectText)) {
    firstBlock.costs = [
      {
        cost: "trashCharacter",
        amount: 1,
        filters: [{ filter: "power", comparison: "gte", value: 6000 }],
      },
    ];
    const play = firstBlock.actions.find((action) => action.action === "play");
    if (play?.action === "play") {
      play.filters = [
        { filter: "trait", value: "FILM", match: "exact" },
        { filter: "power", comparison: "gte", value: 2000 },
        { filter: "power", comparison: "lte", value: 5000 },
        { filter: "cardCategory", value: "character" },
      ];
    }
  }
  if (
    firstBlock &&
    /place this Character at the bottom of the owner['’]s deck:/i.test(effectText)
  ) {
    firstBlock.costs = [{ cost: "returnThisToDeck", position: "bottom" }];
  }
  const leadingLeaderConditionalCost =
    /If\s+your\s+Leader\s+is\s+\[([^\]]+)\],\s*you\s+may\s+[^:]+:/i.exec(effectText);
  if (firstBlock && leadingLeaderConditionalCost) {
    const leaderCondition = {
      condition: "leaderName" as const,
      name: leadingLeaderConditionalCost[1]!,
    };
    if (!firstBlock.conditions?.some((condition) => condition.condition === "leaderName")) {
      firstBlock.conditions = [leaderCondition, ...(firstBlock.conditions ?? [])];
    }
  }
  if (
    firstBlock &&
    /returns all cards in their hand to their deck and shuffles their deck/i.test(effectText)
  ) {
    firstBlock.actions = [{ action: "redrawHand", player: "opponent", drawCount: 5 }];
  }
  if (firstBlock && /activates \[Blocker\] or an Event/i.test(effectText)) {
    const eventBlock: EffectBlock = { ...firstBlock, trigger: "whenOpponentActivatesEvent" };
    effectBlocks.push(eventBlock);
    const blockerIndex = keywords.indexOf("blocker");
    if (blockerIndex >= 0) keywords.splice(blockerIndex, 1);
  }
  if (firstBlock && /activates an Event or \[Trigger\]/i.test(effectText)) {
    if (firstBlock.oncePerTurn) {
      firstBlock.oncePerTurnKey = "opponentEventOrTrigger";
    }
    effectBlocks.push({
      ...firstBlock,
      trigger: "whenTriggerActivates",
      eventFilter: { ...firstBlock.eventFilter, causedBy: "opponent" },
    });
  }
  if (
    firstBlock &&
    /activates \[Blocker\]/i.test(effectText) &&
    !/(?:^|\n)\s*\[Blocker\](?:\s*\(|\s*$)/im.test(effectText)
  ) {
    const blockerIndex = keywords.indexOf("blocker");
    if (blockerIndex >= 0) keywords.splice(blockerIndex, 1);
  }
  if (
    effectBlocks[0] &&
    (/trash 1 of your Characters with 6000 power or more/i.test(effectText) ||
      /place this Character at the bottom of the owner['’]s deck:/i.test(effectText))
  ) {
    const block = effectBlocks[0];
    effectBlocks[0] = {
      trigger: block.trigger,
      ...(block.conditions && { conditions: block.conditions }),
      ...(block.costs && { costs: block.costs }),
      actions: block.actions,
      ...(block.optional && { optional: true }),
      ...(block.oncePerTurn && { oncePerTurn: true }),
      ...(block.oncePerTurnKey && { oncePerTurnKey: block.oncePerTurnKey }),
    };
  }

  const result: CardEffects = {};
  const startStage =
    /at the start of the game, play up to 1 [[{]([^\]}]+)[\]}] type Stage card from your deck/i.exec(
      effectText,
    );
  if (startStage)
    result.startOfGame = {
      playStageFromDeck: { filters: [{ filter: "trait", value: startStage[1]!, match: "exact" }] },
    };

  if (deckBuildingRules.length > 0) result.deckBuildingRules = deckBuildingRules;
  if (keywords.length > 0) result.keywords = keywords;
  if (effectBlocks.length > 0) result.effects = effectBlocks;
  if (permanentEffects.length > 0) result.permanentEffects = permanentEffects;
  if (replacementEffects.length > 0) {
    result.replacementEffects = replacementEffects;
  }
  return result;
}

// ── Replacement effect helpers ──

function findReplacementConditions(conditions: Condition[]): Condition[] {
  const result: Condition[] = [];
  for (const c of conditions) {
    if (c.condition === "replacement") {
      result.push(c);
    } else if (
      c.condition === "compound" &&
      c.conditions.some((sub) => sub.condition === "replacement")
    ) {
      result.push(c);
    }
  }
  return result;
}

function mapReplacementEvent(
  event: "ko" | "removed" | "rested" | "leave",
): "ko" | "removeFromField" | "leaveField" | "rested" {
  switch (event) {
    case "ko":
      return "ko";
    case "removed":
      return "removeFromField";
    case "leave":
      return "leaveField";
    case "rested":
      return "rested";
  }
}
