import { cards as cyberpunkCards, getMergedCyberpunkCardsById } from "@tcg/cyberpunk-cards";

export interface CyberpunkShareStats {
  averageCost: number;
  averagePower: number | null;
  sellTagCount: number;
  mainDeckCount: number;
  types: Array<{ label: string; count: number; color: string }>;
  curve: Array<{ cost: string; count: number; colors: Array<{ count: number; color: string }> }>;
}

const CARD_COLORS: Record<string, string> = {
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#fcee0a",
};
const TYPE_COLORS: Record<string, string> = {
  unit: "#38bdf8",
  program: "#a78bfa",
  gear: "#fb923c",
};
const GENERATED_CARDS_BY_ID = new Map(cyberpunkCards.map((card) => [card.canonicalId, card]));

export function buildCyberpunkShareStats(
  cards: readonly { canonicalId?: string; quantity: number }[],
): CyberpunkShareStats | null {
  if (cards.length === 0) return null;
  const catalog = getMergedCyberpunkCardsById();
  const curve = new Map<number, Map<string, number>>();
  const types = new Map<string, number>();
  let mainDeckCount = 0;
  let totalCost = 0;
  let sellTagCount = 0;
  let unitCount = 0;
  let unitPower = 0;
  for (const entry of cards) {
    const card = entry.canonicalId
      ? (catalog.get(entry.canonicalId) ?? GENERATED_CARDS_BY_ID.get(entry.canonicalId))
      : undefined;
    if (!card || card.type === "legend" || card.cost === null || card.cost === undefined)
      return null;
    const quantity = entry.quantity;
    mainDeckCount += quantity;
    totalCost += card.cost * quantity;
    sellTagCount += card.hasSellTag ? quantity : 0;
    types.set(card.type, (types.get(card.type) ?? 0) + quantity);
    if (card.type === "unit") {
      unitCount += quantity;
      unitPower += card.power * quantity;
    }
    const band = Math.min(card.cost, 10);
    const colors = curve.get(band) ?? new Map<string, number>();
    colors.set(card.color, (colors.get(card.color) ?? 0) + quantity);
    curve.set(band, colors);
  }
  const maxCost = Math.max(...curve.keys(), 0);
  return {
    averageCost: totalCost / mainDeckCount,
    averagePower: unitCount > 0 ? unitPower / unitCount : null,
    sellTagCount,
    mainDeckCount,
    types: ["unit", "program", "gear"]
      .filter((type) => (types.get(type) ?? 0) > 0)
      .map((type) => ({
        label: `${type[0]!.toUpperCase()}${type.slice(1)}s`,
        count: types.get(type)!,
        color: TYPE_COLORS[type]!,
      })),
    curve: Array.from({ length: maxCost + 1 }, (_, cost) => {
      const colors = [...(curve.get(cost)?.entries() ?? [])].map(([name, count]) => ({
        count,
        color: CARD_COLORS[name] ?? "#94a3b8",
      }));
      return {
        cost: cost === 10 ? "10+" : String(cost),
        count: colors.reduce((sum, color) => sum + color.count, 0),
        colors,
      };
    }),
  };
}
