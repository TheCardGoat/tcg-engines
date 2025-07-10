import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const kronkRelaxed: LorcanitoCharacterCard = {
  id: "e8c",
  name: "Kronk",
  title: "Laid Back",
  characteristics: ["storyborn", "ally"],
  text: "Ward\nI'M LOVING THIS If an effect would cause you to discard one or more cards, you don't discard.",
  type: "character",
  abilities: [
    wardAbility,
    {
      type: "static",
      ability: "meta",
      name: "I'M LOVING THIS",
      text: "If an effect would cause you to discard one or more cards, you don't discard.",
    },
  ],
  inkwell: false,
  // @ts-expect-error
  color: "",
  colors: ["amethyst", "emerald"],
  cost: 5,
  strength: 4,
  willpower: 4,
  illustrator: "Tony Bancroft / Lindsay Weyman",
  number: 63,
  set: "007",
  rarity: "rare",
  lore: 2,
};
