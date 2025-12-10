import type { CharacterCard } from "@tcg/lorcana";

export const gantuGalacticFederationCaptain: CharacterCard = {
  id: "c3k",
  cardType: "character",
  name: "Gantu",
  version: "Galactic Federation Captain",
  fullName: "Gantu - Galactic Federation Captain",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "001",
  text: "UNDER ARREST Characters with cost 2 or less can't challenge your characters.",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 178,
  inkable: true,
  externalIds: {
    ravensburger: "2b9addfb94c8f45cfa1bb249ef2d1021ddee733e",
  },
  abilities: [
    {
      id: "c3k-1",
      text: "UNDER ARREST Characters with cost 2 or less can't challenge your characters.",
      name: "UNDER ARREST",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
    },
  ],
  classifications: ["Storyborn", "Alien", "Captain"],
};
