import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnGoldLover: CharacterCard = {
  id: "1b5",
  cardType: "character",
  name: "Prince John",
  version: "Gold Lover",
  fullName: "Prince John - Gold Lover",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  text: "BEAUTIFUL, LOVELY TAXES {E} — Play an item from your hand or discard with cost 5 or less for free, exerted.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 147,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a9c072cf5b48edda82d051442b832712beead027",
  },
  abilities: [
    {
      id: "1b5-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "play-card",
        from: "hand",
        cost: "free",
        costRestriction: {
          comparison: "less-or-equal",
          value: 5,
        },
      },
      text: "BEAUTIFUL, LOVELY TAXES {E} — Play an item from your hand or discard with cost 5 or less for free, exerted.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
};
