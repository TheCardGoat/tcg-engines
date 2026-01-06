import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const belle: CharacterCard = {
  id: "uxx",
  cardType: "character",
  name: "Belle",
  version: "Strange but Special",
  fullName: "Belle - Strange but Special",
  inkType: [
    "sapphire",
  ],
  franchise: "General",
  set: "001",
  text: "**READ A BOOK** During your turn, you may put an additional card from your hand into your inkwell facedown.

**MY FAVOURITE PART!** While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 142,
  inkable: true,
  rarity: "legendary",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508816,
  },
  classifications: [
    "Hero",
    "Storyborn",
    "Princess",
  ],
  abilities: [
    {
      type: "static",
      effect: {
          type: "restriction",
          restriction: "cant-sing",
          target: "SELF",
        },
      id: "uxx-1",
      text: {
          name: "My Favourite Part!",
          text: "While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
          conditions: [
            {
              type: "inkwell",
              amount: 10,
            },
          ],
          attribute: "lore",
          amount: 4,
        },
    },
  ],
};
