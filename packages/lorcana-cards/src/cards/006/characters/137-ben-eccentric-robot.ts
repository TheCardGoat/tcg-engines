import type { CharacterCard } from "@tcg/lorcana";

export const benEccentricRobot: CharacterCard = {
  id: "1b4",
  cardType: "character",
  name: "B.E.N.",
  version: "Eccentric Robot",
  fullName: "B.E.N. - Eccentric Robot",
  inkType: ["sapphire"],
  franchise: "Treasure Planet",
  set: "006",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "137",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "aa97f4df72681860790f4df212f77ab3bf9a7239",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "1b4a1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally", "Robot", "Pirate"],
};
