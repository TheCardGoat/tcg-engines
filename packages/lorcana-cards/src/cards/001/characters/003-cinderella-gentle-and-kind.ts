import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const cinderella: CharacterCard = {
  id: "qil",
  cardType: "character",
  name: "Cinderella",
  version: "Gentle and Kind",
  fullName: "Cinderella - Gentle and Kind",
  inkType: [
    "amber",
  ],
  franchise: "Cinderella",
  set: "001",
  text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_

**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 3,
  inkable: true,
  rarity: "uncommon",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508692,
  },
  classifications: [
    "Hero",
    "Storyborn",
    "Princess",
  ],
  abilities: [
    {
      type: "activated",
      cost: {
          exert: true,
        },
      effect: {
          type: "remove-damage",
          amount: 3,
          upTo: true,
          target: "CHOSEN_CHARACTER",
        },
      name: "A WONDERFUL DREAM",
      id: "qil-1",
      text: "{E}− Remove up to 3 damage from chosen Princess character.",
    },
    {
      type: "keyword",
      keyword: "Singer",
      value: 5,
      id: "qil-2",
      text: "**Singer** 5 _(This character counts as cost 4 to sing songs.)_",
    },
  ],
};
