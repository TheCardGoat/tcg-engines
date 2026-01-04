import type { CharacterCard } from "@tcg/lorcana-types";

export const violetSabrewingSeniorJuniorWoodchuck: CharacterCard = {
  id: "ynj",
  cardType: "character",
  name: "Violet Sabrewing",
  version: "Senior Junior Woodchuck",
  fullName: "Violet Sabrewing - Senior Junior Woodchuck",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 44,
  inkable: true,
  externalIds: {
    ravensburger: "7ce568a37fd12efd3f1a26e586a792d5ec9ae132",
  },
  abilities: [
    {
      id: "ynj-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
