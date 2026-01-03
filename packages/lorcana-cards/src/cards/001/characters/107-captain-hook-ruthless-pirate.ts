import type { CharacterCard } from "@tcg/lorcana-types";

export const CaptainHookRuthlessPirate: CharacterCard = {
  id: "1k7",
  cardType: "character",
  name: "Captain Hook",
  version: "Ruthless Pirate",
  fullName: "Captain Hook - Ruthless Pirate",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)\nYOU COWARD! While this character is exerted, opposing characters with Evasive gain Reckless. (They can't quest and must challenge if able.)",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 107,
  inkable: false,
  externalIds: {
    ravensburger: "cb7f49afcece80ca059a1b80ac84424a7d69eeaa",
  },
  abilities: [
    {
      id: "1k7-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
    {
      id: "1k7-2",
      text: "YOU COWARD! While this character is exerted, opposing characters with Evasive gain Reckless.",
      name: "YOU COWARD!",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "SELF",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
};
