import type { CharacterCard } from "@tcg/lorcana";

export const blueFairyGuidingLight: CharacterCard = {
  id: "1iq",
  cardType: "character",
  name: "Blue Fairy",
  version: "Guiding Light",
  fullName: "Blue Fairy - Guiding Light",
  inkType: ["amethyst", "sapphire"],
  franchise: "Pinocchio",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 71,
  inkable: true,
  externalIds: {
    ravensburger: "c55096e67e224a1eabfda7b31c8dbf8f2977eb5b",
  },
  abilities: [
    {
      id: "1iq-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "1iq-2",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};
