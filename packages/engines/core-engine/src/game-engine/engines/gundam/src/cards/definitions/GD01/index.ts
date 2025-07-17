import type { GundamitoCard } from "../cardTypes";
import { side7 } from "./bases/bases";
import { theWitchAndTheBride } from "./commands/commands";
import { banagherLinks } from "./pilots/pilots";
import { strikeDaggerGATX105, strikeGundam } from "./units/units";

export const allCardsGD01Cards: GundamitoCard[] = [
  side7,
  theWitchAndTheBride,
  banagherLinks,
  strikeGundam,
  // Add more cards as they are implemented
];

export const allCardsGD01CardsById: Record<string, GundamitoCard> = {};
allCardsGD01Cards.forEach((card) => {
  allCardsGD01CardsById[card.id] = card;
});

// Re-export for convenience
export { side7 } from "./bases/bases";
export { theWitchAndTheBride } from "./commands/commands";
export { banagherLinks } from "./pilots/pilots";
export { strikeDaggerGATX105, strikeGundam } from "./units/units";
