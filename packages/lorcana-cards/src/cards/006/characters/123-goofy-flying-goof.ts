import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyFlyingGoof: CharacterCard = {
  abilities: [
    {
      id: "1i6-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      id: "1i6-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 123,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "c2cae8618c5864d48ef0976fe51bceeccce58b3f",
  },
  fullName: "Goofy - Flying Goof",
  id: "1i6",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  name: "Goofy",
  set: "006",
  strength: 5,
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)",
  version: "Flying Goof",
  willpower: 5,
};
