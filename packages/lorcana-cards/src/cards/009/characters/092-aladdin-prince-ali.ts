import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinPrinceAli: CharacterCard = {
  abilities: [
    {
      id: "820-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
  ],
  cardNumber: 92,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 2,
  externalIds: {
    ravensburger: "1d08728f58803b68227b42d077f73afbfe1f9880",
  },
  franchise: "Aladdin",
  fullName: "Aladdin - Prince Ali",
  id: "820",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  name: "Aladdin",
  set: "009",
  strength: 2,
  text: "Ward (Opponents can't choose this character except to challenge.)",
  version: "Prince Ali",
  willpower: 2,
};
