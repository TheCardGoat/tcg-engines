import type { CharacterCard } from "@tcg/lorcana-types";

export const blueFairyGuidingLight: CharacterCard = {
  abilities: [
    {
      id: "1iq-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      id: "1iq-2",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 71,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Fairy"],
  cost: 2,
  externalIds: {
    ravensburger: "c55096e67e224a1eabfda7b31c8dbf8f2977eb5b",
  },
  franchise: "Pinocchio",
  fullName: "Blue Fairy - Guiding Light",
  id: "1iq",
  inkType: ["amethyst", "sapphire"],
  inkable: true,
  lore: 1,
  name: "Blue Fairy",
  set: "008",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Guiding Light",
  willpower: 2,
};
