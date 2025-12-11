import type { CharacterCard } from "@tcg/lorcana";

export const peterPanHighFlyer: CharacterCard = {
  id: "1sq",
  cardType: "character",
  name: "Peter Pan",
  version: "High Flyer",
  fullName: "Peter Pan - High Flyer",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 105,
  inkable: true,
  externalIds: {
    ravensburger: "067ac8173c1f60f06e456367ff8785feaa83214f",
  },
  abilities: [
    {
      id: "1sq-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
