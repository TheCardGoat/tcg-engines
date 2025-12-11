import type { CharacterCard } from "@tcg/lorcana";

export const kitCloudkickerSpunkyBearCub: CharacterCard = {
  id: "hkt",
  cardType: "character",
  name: "Kit Cloudkicker",
  version: "Spunky Bear Cub",
  fullName: "Kit Cloudkicker - Spunky Bear Cub",
  inkType: ["sapphire"],
  franchise: "Talespin",
  set: "003",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  cardNumber: 148,
  inkable: true,
  externalIds: {
    ravensburger: "3f5ab1825bd1fe21e090a0b8eff482833549bc44",
  },
  abilities: [
    {
      id: "hkt-1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
