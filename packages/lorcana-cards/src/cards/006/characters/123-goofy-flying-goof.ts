import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyFlyingGoof: CharacterCard = {
  id: "1i6",
  cardType: "character",
  name: "Goofy",
  version: "Flying Goof",
  fullName: "Goofy - Flying Goof",
  inkType: ["ruby"],
  set: "006",
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  cardNumber: 123,
  inkable: false,
  externalIds: {
    ravensburger: "c2cae8618c5864d48ef0976fe51bceeccce58b3f",
  },
  abilities: [
    {
      id: "1i6-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
    {
      id: "1i6-2",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
