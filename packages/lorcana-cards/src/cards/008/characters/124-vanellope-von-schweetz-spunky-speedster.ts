import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzSpunkySpeedster: CharacterCard = {
  id: "1we",
  cardType: "character",
  name: "Vanellope Von Schweetz",
  version: "Spunky Speedster",
  fullName: "Vanellope Von Schweetz - Spunky Speedster",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 124,
  inkable: true,
  externalIds: {
    ravensburger: "f688dbd85d7d9d0deb20a991bf4299135b286ae0",
  },
  abilities: [
    {
      id: "1we-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Racer"],
};
