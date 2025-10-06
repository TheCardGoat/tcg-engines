import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const galeWindSpirit: LorcanaCharacterCardDefinition = {
  id: "coq",
  name: "Gale",
  title: "Wind Spirit",
  characteristics: ["storyborn", "ally"],
  text: "**RECURRING GUST** When this character is banished, return this card to your hand.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "Recurring Gust",
      text: "When this character is banished, return this card to your hand.",
      effects: [returnThisCardToHand],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 2,
  illustrator: "Amber Kommavongsa",
  number: 42,
  set: "SSK",
  rarity: "common",
};
