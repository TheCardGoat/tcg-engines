import type { CharacterCard } from "@tcg/lorcana-types";

export const perlaNimbleSeamstress: CharacterCard = {
  id: "wjh",
  cardType: "character",
  name: "Perla",
  version: "Nimble Seamstress",
  fullName: "Perla - Nimble Seamstress",
  inkType: ["amber", "emerald"],
  franchise: "Cinderella",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 32,
  inkable: true,
  externalIds: {
    ravensburger: "754809c4ccbf3140a82f6fcb4d3f7feb624fb42f",
  },
  abilities: [
    {
      id: "wjh-1",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "wjh-2",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
