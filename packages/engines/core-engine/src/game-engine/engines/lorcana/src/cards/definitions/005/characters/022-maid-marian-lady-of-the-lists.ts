import { chosenOpposingCharacterLoseStrengthUntilNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maidMarianLadyOfTheLists: LorcanitoCharacterCardDefinition = {
  id: "wd5",
  name: "Maid Marian",
  title: "Lady of the Lists",
  characteristics: ["dreamborn", "princess"],
  text: "**IF IT PLEASES THE LADY** When you play this character, opposing character of your choice gets -5 {S} until the start of your next turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "IF THE LADY WANTS IT",
      text: "When you play this character, opposing character of your choice gets -5 {S} until the start of your next turn.",
      effects: [chosenOpposingCharacterLoseStrengthUntilNextTurn(5)],
    },
  ],
  flavour: "And who might you be, my noble Knight and champion?",
  inkwell: true,
  colors: ["amber"],
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Jenna Grey",
  number: 22,
  set: "SSK",
  rarity: "uncommon",
};
