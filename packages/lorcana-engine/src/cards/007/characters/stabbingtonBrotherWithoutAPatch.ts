import {
  rushAbility,
  yourCharactersNamedGain,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const stabbingtonBrotherWithoutAPatch: LorcanitoCharacterCard = {
  id: "l12",
  name: "Stabbington Brother",
  title: "Without a Patch",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: false,
  colors: ["ruby"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Florencia Vazquez",
  number: 125,
  set: "007",
  rarity: "common",
  lore: 1,
  text: "Rush\nGET 'EM! Your other characters named Stabbington Brother gain Rush.",
  abilities: [
    rushAbility,
    yourCharactersNamedGain({
      name: "Stabbington Brother",
      ability: rushAbility,
      excludeSelf: true,
    }),
  ],
};
