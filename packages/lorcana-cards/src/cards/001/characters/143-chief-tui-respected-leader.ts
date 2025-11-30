import type { CharacterCard } from "@tcg/lorcana";

export const chiefTuiRespectedLeader: CharacterCard = {
  id: "qai",
  cardType: "character",
  name: "Chief Tui",
  version: "Respected Leader",
  fullName: "Chief Tui - Respected Leader",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "001",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "143",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "5ec21d0830840f21954cd2a68de6906e36a893ed",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "qai-ability-1",
      text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Mentor", "King"],
};
