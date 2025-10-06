import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { putThisCardIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const grammaTalaStoryteller: LorcanaCharacterCardDefinition = {
  id: "n00",

  name: "Gramma Tala",
  title: "Storyteller",
  characteristics: ["storyborn", "mentor"],
  text: "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "I Will Be With You",
      text: "When this character is banished, you may put this card into your inkwell facedown and exerted.",
      optional: true,
      effects: [putThisCardIntoYourInkwellExerted],
    }),
  ],
  flavour:
    "Moana: Is there something you want to tell me?\nGramma Tala: Is there something you want to hear?",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  illustrator: "Filipe Laurentino",
  number: 146,
  set: "TFC",
  rarity: "uncommon",
};
