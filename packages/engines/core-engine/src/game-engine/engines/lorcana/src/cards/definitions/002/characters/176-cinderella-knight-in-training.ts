import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cinderellaKnightInTraining: LorcanitoCharacterCardDefinition = {
  id: "y7h",
  name: "Cinderella",
  title: "Knight in Training",
  characteristics: ["hero", "dreamborn", "princess", "knight"],
  text: "**HAVE COURAGE** When you play this character, you may draw a card, then choose and discard a card.",
  type: "character",
  abilities: [
    {
      ...youMayDrawThenChooseAndDiscard,
      name: "Have Courage",
      text: "When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  flavour:
    "She's always had the heart of a champion - now she'll have the skills, too.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Grace Tran",
  number: 176,
  set: "ROF",
  rarity: "common",
};
