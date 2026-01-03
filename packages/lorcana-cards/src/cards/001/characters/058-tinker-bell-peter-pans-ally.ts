import type { CharacterCard } from "@tcg/lorcana-types";

export const TinkerBellPeterPansAlly: CharacterCard = {
  id: "oug",
  cardType: "character",
  name: "Tinker Bell",
  version: "Peter Pan’s Ally",
  fullName: "Tinker Bell - Peter Pan’s Ally",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1. (They get +1 {S} while challenging.)",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 58,
  inkable: false,
  externalIds: {
    ravensburger: "598be1e1fde814f7659cf509dad4db7131a68730",
  },
  abilities: [
    {
      id: "oug-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "oug-2",
      text: "LOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1.",
      name: "LOYAL AND DEVOTED",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 1,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};
