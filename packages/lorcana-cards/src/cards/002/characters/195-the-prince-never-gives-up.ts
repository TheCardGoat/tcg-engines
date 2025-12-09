import type { CharacterCard } from "@tcg/lorcana";

export const thePrinceNeverGivesUp: CharacterCard = {
  id: "14d",
  cardType: "character",
  name: "The Prince",
  version: "Never Gives Up",
  fullName: "The Prince - Never Gives Up",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "002",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +1 (Damage dealt to this character is reduced by 1.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 195,
  inkable: true,
  externalIds: {
    ravensburger: "9351aa8ca706988419d548e97f2d1c534856a8d0",
  },
  abilities: [
    {
      id: "14d-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "14d-2",
      text: "Resist +1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
