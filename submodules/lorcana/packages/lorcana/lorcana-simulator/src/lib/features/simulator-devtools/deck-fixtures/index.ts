/**
 * Lorcana deck list fixtures (name + newline-separated card lines).
 * Each JSON file has: { name: string; cards: string }
 */

import steelSapphireMidrange from "./steel-sapphire-midrange.json" with { type: "json" };
import steelSapphireAggressive from "./steel-sapphire-aggressive.json" with { type: "json" };
import amberSteelGoofyLilo from "./amber-steel-goofy-lilo.json" with { type: "json" };
import amberSteelLiloRapunzel from "./amber-steel-lilo-rapunzel.json" with { type: "json" };
import amberAmethystControl from "./amber-amethyst-control.json" with { type: "json" };
import amberAmethystAggressive from "./amber-amethyst-aggressive.json" with { type: "json" };
import steelAmethystBasilGenie from "./steel-amethyst-basil-genie.json" with { type: "json" };
import emeraldAmethystInk from "./emerald-amethyst-ink.json" with { type: "json" };

export interface DeckFixture {
  id: string;
  name: string;
  cards: string;
}

function createDeckFixture(id: string, fixture: Omit<DeckFixture, "id">): DeckFixture {
  return {
    id,
    ...fixture,
  };
}

export const steelSapphireMidrangeFixture = createDeckFixture(
  "steel-sapphire-midrange",
  steelSapphireMidrange,
);
export const steelSapphireAggressiveFixture = createDeckFixture(
  "steel-sapphire-aggressive",
  steelSapphireAggressive,
);
export const amberSteelGoofyLiloFixture = createDeckFixture(
  "amber-steel-goofy-lilo",
  amberSteelGoofyLilo,
);
export const amberSteelLiloRapunzelFixture = createDeckFixture(
  "amber-steel-lilo-rapunzel",
  amberSteelLiloRapunzel,
);
export const amberAmethystControlFixture = createDeckFixture(
  "amber-amethyst-control",
  amberAmethystControl,
);
export const amberAmethystAggressiveFixture = createDeckFixture(
  "amber-amethyst-aggressive",
  amberAmethystAggressive,
);
export const steelAmethystBasilGenieFixture = createDeckFixture(
  "steel-amethyst-basil-genie",
  steelAmethystBasilGenie,
);
export const emeraldAmethystInkFixture = createDeckFixture(
  "emerald-amethyst-ink",
  emeraldAmethystInk,
);

export const DECK_FIXTURES: DeckFixture[] = [
  steelSapphireMidrangeFixture,
  steelSapphireAggressiveFixture,
  amberSteelGoofyLiloFixture,
  amberSteelLiloRapunzelFixture,
  amberAmethystControlFixture,
  amberAmethystAggressiveFixture,
  steelAmethystBasilGenieFixture,
  emeraldAmethystInkFixture,
];

export {
  amberAmethystAggressiveFixture as amberAmethystAggressive,
  amberAmethystControlFixture as amberAmethystControl,
  amberSteelGoofyLiloFixture as amberSteelGoofyLilo,
  amberSteelLiloRapunzelFixture as amberSteelLiloRapunzel,
  emeraldAmethystInkFixture as emeraldAmethystInk,
  steelAmethystBasilGenieFixture as steelAmethystBasilGenie,
  steelSapphireAggressiveFixture as steelSapphireAggressive,
  steelSapphireMidrangeFixture as steelSapphireMidrange,
};
