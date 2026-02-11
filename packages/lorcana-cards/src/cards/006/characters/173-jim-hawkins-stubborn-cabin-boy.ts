import type { CharacterCard } from "@tcg/lorcana-types";

export const jimHawkinsStubbornCabinBoy: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "SELF",
        value: 2,
        duration: "this-turn",
      },
      id: "tx8-1",
      text: "COME HERE, COME HERE, COME HERE! During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn.",
      type: "action",
    },
  ],
  cardNumber: 173,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "6bd8397ecb06c70e85f625ba6d01900bc5dac7e2",
  },
  franchise: "Treasure Planet",
  fullName: "Jim Hawkins - Stubborn Cabin Boy",
  id: "tx8",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Jim Hawkins",
  set: "006",
  strength: 0,
  text: "COME HERE, COME HERE, COME HERE! During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn. (While challenging, this character gets +2 {S}.)",
  version: "Stubborn Cabin Boy",
  willpower: 4,
};
