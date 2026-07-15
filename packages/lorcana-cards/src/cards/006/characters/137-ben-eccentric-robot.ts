import type { CharacterCard } from "@tcg/lorcana-types";

export const benEccentricRobot: CharacterCard = {
  abilities: [
    {
      id: "1b2-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 137,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Robot", "Pirate"],
  cost: 4,
  externalIds: {
    ravensburger: "aa97f4df72681860790f4df212f77ab3bf9a7239",
  },
  franchise: "Treasure Planet",
  fullName: "B.E.N. - Eccentric Robot",
  id: "1b2",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "B.E.N.",
  set: "006",
  strength: 4,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Eccentric Robot",
  willpower: 3,
};
