import type { DeckMetadataFacet } from "@tcg/shared/game-adapter";

const RAM_COLORS = ["blue", "green", "red", "yellow"] as const;

interface LegendRam {
  color: string;
  ram: number | null;
}

/** Deck-construction limits (CR 3.20.5), not the Legends' in-game state. */
export function projectRamDistribution(legends: readonly LegendRam[]): DeckMetadataFacet | null {
  if (legends.length !== 3) return null;
  const amounts = RAM_COLORS.map((color) => ({ color, ram: 0 }));
  for (const legend of legends) {
    const amount = amounts.find(({ color }) => color === legend.color);
    if (!amount || legend.ram === null || !Number.isInteger(legend.ram) || legend.ram < 0) {
      return null;
    }
    amount.ram += legend.ram;
  }
  const supplied = amounts.filter(({ ram }) => ram > 0);
  return {
    type: "ram-coalition",
    key: amounts.map(({ color, ram }) => `${color}:${ram}`).join("|"),
    label: supplied
      .map(({ color, ram }) => `${ram} ${color[0].toUpperCase()}${color.slice(1)}`)
      .join(" / "),
    colors: supplied.map(({ color }) => color),
  };
}
