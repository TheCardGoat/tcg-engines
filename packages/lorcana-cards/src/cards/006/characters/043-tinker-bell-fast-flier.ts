import type { CharacterCard } from "@tcg/lorcana";

export const tinkerBellFastFlier: CharacterCard = {
  id: "1k9",
  cardType: "character",
  name: "Tinker Bell",
  version: "Fast Flier",
  fullName: "Tinker Bell - Fast Flier",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 43,
  inkable: true,
  externalIds: {
    ravensburger: "cacdb6abf873de6f92bea008b9b53b48adb1624c",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1k9-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};
