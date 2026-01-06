import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const starkey: CharacterCard = {
  id: "wxx",
  cardType: "character",
  name: "Starkey",
  version: "Hook's Henchman",
  fullName: "Starkey - Hook's Henchman",
  inkType: ["steel"],
  franchise: "General",
  set: "001",
  text: "**AYE AYE, CAPTAIN** While you have a Captain character in play, this character gets +1 {L}.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  cardNumber: 191,
  inkable: true,
  rarity: "uncommon",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508947,
  },
  classifications: ["Storyborn", "Pirate", "Ally"],
  abilities: [
    {
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "SELF",
      },
      id: "wxx-1",
      text: {
        name: "Ay Aye, Captain",
        text: "While you have a Captain character in play, this character gets +1 {L}.",
        conditions: [
          {
            type: "condition",
            text: "if you have a Captain in play",
          },
        ],
        attribute: "lore",
        amount: 1,
      },
    },
  ],
};
