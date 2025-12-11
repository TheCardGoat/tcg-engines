import type { CharacterCard } from "@tcg/lorcana";

export const aladdinPrinceAli: CharacterCard = {
  id: "820",
  cardType: "character",
  name: "Aladdin",
  version: "Prince Ali",
  fullName: "Aladdin - Prince Ali",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "009",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 92,
  inkable: true,
  externalIds: {
    ravensburger: "1d08728f58803b68227b42d077f73afbfe1f9880",
  },
  abilities: [
    {
      id: "820-1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
