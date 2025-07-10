import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const wendyDarlingPirateQueen: LorcanitoCharacterCard = {
  id: "ge4",
  name: "Wendy Darling",
  title: "Pirate Queen",
  characteristics: ["dreamborn", "hero", "queen", "pirate", "captain"],
  text: "Evasive\nTELL NO TALES Whenever one of your other characters is banished, you may remove all damage from chosen character.",
  type: "character",
  abilities: [
    evasiveAbility,
    whenYourOtherCharactersIsBanished({
      name: "TELL NO TALES",
      text: "Whenever one of your other characters is banished, you may remove all damage from chosen character.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 99,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amber", "ruby"],
  cost: 7,
  strength: 5,
  willpower: 7,
  illustrator: "Jochem van Gool",
  number: 12,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
