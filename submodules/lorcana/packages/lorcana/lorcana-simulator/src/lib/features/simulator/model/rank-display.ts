const TIER_ICON_BASE_URL = "https://cdn.tcg.online/public/thecardgoat/tiers";

const BRACKET_ALIASES: Record<string, RankBracketId> = {
  seed: "iron",
  seeded: "iron",
};

export type RankBracketId =
  | "placement"
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master";

export interface RankDisplay {
  bracketId: RankBracketId;
  label: string;
  iconSrc: string | null;
}

export function normalizeRankBracketId(bracketId: string | null | undefined): RankBracketId | null {
  if (!bracketId) return null;
  const normalized = bracketId.trim().toLowerCase();
  const aliased = BRACKET_ALIASES[normalized] ?? normalized;
  switch (aliased) {
    case "placement":
    case "iron":
    case "bronze":
    case "silver":
    case "gold":
    case "platinum":
    case "diamond":
    case "master":
      return aliased;
    default:
      return null;
  }
}

export function rankBracketLabel(bracketId: RankBracketId): string {
  switch (bracketId) {
    case "placement":
      return "Placement";
    case "iron":
      return "Iron";
    case "bronze":
      return "Bronze";
    case "silver":
      return "Silver";
    case "gold":
      return "Gold";
    case "platinum":
      return "Platinum";
    case "diamond":
      return "Diamond";
    case "master":
      return "Master";
  }
}

export function rankBracketIconSrc(bracketId: RankBracketId): string | null {
  return bracketId === "placement" ? null : `${TIER_ICON_BASE_URL}/${bracketId}-bracket.webp`;
}

export function rankDisplayFromBracket(bracketId: string | null | undefined): RankDisplay | null {
  const normalized = normalizeRankBracketId(bracketId);
  if (!normalized) return null;
  return {
    bracketId: normalized,
    label: rankBracketLabel(normalized),
    iconSrc: rankBracketIconSrc(normalized),
  };
}
