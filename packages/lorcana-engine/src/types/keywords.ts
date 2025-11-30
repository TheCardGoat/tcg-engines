/**
 * Keywords (Section 10)
 *
 * Lorcana has 12 keywords:
 * - Simple keywords: Bodyguard, Evasive, Reckless, Rush, Support, Vanish, Ward
 * - Parameterized keywords: Challenger +X, Resist +X (stacking)
 * - Complex keywords: Shift, Singer X, Sing Together X
 */

/** Simple keywords that have no parameters */
export const SIMPLE_KEYWORDS = [
  "Alert",
  "Bodyguard",
  "Evasive",
  "Reckless",
  "Rush",
  "Support",
  "Vanish",
  "Ward",
] as const;

export type SimpleKeyword = (typeof SIMPLE_KEYWORDS)[number];

/** Parameterized keywords with numeric values that can stack */
export interface ChallengerKeyword {
  type: "Challenger";
  value: number;
}

export interface ResistKeyword {
  type: "Resist";
  value: number;
}

export type ParameterizedKeyword = ChallengerKeyword | ResistKeyword;

/** Complex keywords with special behaviors */
export interface ShiftKeyword {
  type: "Shift";
  cost: number;
  targetName: string;
}

export interface SingerKeyword {
  type: "Singer";
  value: number;
}

export interface SingTogetherKeyword {
  type: "SingTogether";
  value: number;
}

export type ComplexKeyword = ShiftKeyword | SingerKeyword | SingTogetherKeyword;

/** All keyword types */
export type Keyword = SimpleKeyword | ParameterizedKeyword | ComplexKeyword;

/** All keyword type names for parameterized and complex keywords */
export type KeywordType =
  | SimpleKeyword
  | "Challenger"
  | "Resist"
  | "Shift"
  | "Singer"
  | "SingTogether";

/**
 * Check if a keyword is a simple keyword
 */
export function isSimpleKeyword(keyword: Keyword): keyword is SimpleKeyword {
  return typeof keyword === "string";
}

/**
 * Check if a keyword is a parameterized keyword (Challenger or Resist)
 */
export function isParameterizedKeyword(
  keyword: Keyword,
): keyword is ParameterizedKeyword {
  return (
    typeof keyword === "object" &&
    (keyword.type === "Challenger" || keyword.type === "Resist")
  );
}

/**
 * Check if a keyword is a complex keyword (Shift, Singer, SingTogether)
 */
export function isComplexKeyword(keyword: Keyword): keyword is ComplexKeyword {
  return (
    typeof keyword === "object" &&
    (keyword.type === "Shift" ||
      keyword.type === "Singer" ||
      keyword.type === "SingTogether")
  );
}

/**
 * Get the type name of a keyword
 */
export function getKeywordTypeName(keyword: Keyword): KeywordType {
  if (typeof keyword === "string") {
    return keyword;
  }
  return keyword.type;
}

/**
 * Check if a keyword array contains a specific keyword type
 */
export function hasKeywordType(
  keywords: Keyword[] | undefined,
  type: KeywordType,
): boolean {
  if (!keywords) return false;
  return keywords.some((k) => getKeywordTypeName(k) === type);
}

/**
 * Get the value of a parameterized keyword (Challenger or Resist)
 * Returns null if the keyword is not found or is not parameterized
 */
export function getKeywordValue(
  keywords: Keyword[] | undefined,
  type: "Challenger" | "Resist",
): number | null {
  if (!keywords) return null;
  const keyword = keywords.find(
    (k) => typeof k === "object" && k.type === type,
  ) as ParameterizedKeyword | undefined;
  return keyword?.value ?? null;
}

/**
 * Get the total value of a stacking keyword (sums all instances)
 */
export function getTotalKeywordValue(
  keywords: Keyword[] | undefined,
  type: "Challenger" | "Resist",
): number {
  if (!keywords) return 0;
  return keywords
    .filter(
      (k): k is ParameterizedKeyword =>
        typeof k === "object" && k.type === type,
    )
    .reduce((sum, k) => sum + k.value, 0);
}

/**
 * Get Shift keyword data if present
 */
export function getShiftKeyword(
  keywords: Keyword[] | undefined,
): ShiftKeyword | null {
  if (!keywords) return null;
  const keyword = keywords.find(
    (k): k is ShiftKeyword => typeof k === "object" && k.type === "Shift",
  );
  return keyword ?? null;
}

/**
 * Get Singer keyword value if present
 */
export function getSingerValue(keywords: Keyword[] | undefined): number | null {
  if (!keywords) return null;
  const keyword = keywords.find(
    (k): k is SingerKeyword => typeof k === "object" && k.type === "Singer",
  );
  return keyword?.value ?? null;
}

/**
 * Get Sing Together keyword value if present
 */
export function getSingTogetherValue(
  keywords: Keyword[] | undefined,
): number | null {
  if (!keywords) return null;
  const keyword = keywords.find(
    (k): k is SingTogetherKeyword =>
      typeof k === "object" && k.type === "SingTogether",
  );
  return keyword?.value ?? null;
}
