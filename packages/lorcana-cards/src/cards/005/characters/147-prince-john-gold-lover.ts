import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnGoldLover: CharacterCard = {
  abilities: [
    {
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
      id: "1b5-1",
      text: "BEAUTIFUL, LOVELY TAXES {E} — Play an item from your hand or discard with cost 5 or less for free, exerted.",
      type: "activated",
    },
  ],
  cardNumber: 147,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "a9c072cf5b48edda82d051442b832712beead027",
  },
  franchise: "Robin Hood",
  fullName: "Prince John - Gold Lover",
  id: "1b5",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Prince John",
  set: "005",
  strength: 3,
  text: "BEAUTIFUL, LOVELY TAXES {E} — Play an item from your hand or discard with cost 5 or less for free, exerted.",
  version: "Gold Lover",
  willpower: 4,
};
