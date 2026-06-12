import type { CardFilter, HasClassificationFilter, HasKeywordFilter } from "@tcg/lorcana-types";

interface CardDefinitionLike {
  abilities?: Array<{ type?: string; keyword?: string }>;
  classifications?: string[];
}

function isHasKeywordFilter(f: CardFilter): f is HasKeywordFilter {
  return f.type === "has-keyword";
}

function isHasClassificationFilter(f: CardFilter): f is HasClassificationFilter {
  return f.type === "has-classification";
}

export function matchesCardFilterArray(
  filters: CardFilter[],
  definition: CardDefinitionLike,
): boolean {
  for (const f of filters) {
    if (isHasKeywordFilter(f)) {
      const hasKeyword = (definition.abilities ?? []).some(
        (a) => a.type === "keyword" && a.keyword === f.keyword,
      );
      if (!hasKeyword) return false;
    }
    if (isHasClassificationFilter(f)) {
      if (!(definition.classifications ?? []).includes(f.classification)) return false;
    }
  }
  return true;
}
