import type { CharacterCard } from "@tcg/lorcana-types";

export const perlaNimbleSeamstress: CharacterCard = {
  abilities: [
    {
      id: "wjh-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      id: "wjh-2",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 32,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "754809c4ccbf3140a82f6fcb4d3f7feb624fb42f",
  },
  franchise: "Cinderella",
  fullName: "Perla - Nimble Seamstress",
  id: "wjh",
  inkType: ["amber", "emerald"],
  inkable: true,
  lore: 1,
  name: "Perla",
  set: "007",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)",
  version: "Nimble Seamstress",
  willpower: 2,
};
