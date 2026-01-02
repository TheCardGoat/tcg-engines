import type { CharacterCard } from "@tcg/lorcana-types";

export const chiefTuiRespectedLeader: CharacterCard = {
  id: "qai",
  cardType: "character",
  name: "Chief Tui",
  version: "Respected Leader",
  fullName: "Chief Tui - Respected Leader",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "001",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  cardNumber: 143,
  inkable: true,
  externalIds: {
    ravensburger: "5ec21d0830840f21954cd2a68de6906e36a893ed",
  },
  abilities: [
    {
      id: "qai-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Mentor", "King"],
};
