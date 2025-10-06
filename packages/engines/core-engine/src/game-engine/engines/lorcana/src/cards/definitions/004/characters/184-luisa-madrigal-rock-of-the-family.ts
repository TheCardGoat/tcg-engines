import { whileYouHaveAnotherCharacterInPlayThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const luisaMadrigalRockOfTheFamily: LorcanaCharacterCardDefinition = {
  id: "yza",
  name: "Luisa Madrigal",
  title: "Rock of the Family",
  characteristics: ["storyborn", "ally", "madrigal"],
  text: "**I'M THE STRONG ONE** While you have another character in play, this character gets +2 {S}.",
  type: "character",
  abilities: [
    whileYouHaveAnotherCharacterInPlayThisCharacterGets({
      name: "I'm The Strong One",
      text: "While you have another character in play, this character gets +2 {S}.",
      attribute: "strength",
      amount: 2,
    }),
  ],
  flavour: "There's no way Ursula's creatures are getting to that donkey.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Samantha Erdini",
  number: 184,
  set: "URR",
  rarity: "common",
};
