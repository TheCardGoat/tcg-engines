import type { CharacterCard } from "@tcg/lorcana";

export const mulanFreeSpirit: CharacterCard = {
  id: "roa",
  cardType: "character",
  name: "Mulan",
  version: "Free Spirit",
  fullName: "Mulan - Free Spirit",
  inkType: ["amber"],
  franchise: "Mulan",
  set: "009",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "010",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "63be0c9e418d5a0329a87de4082802d18848efe6",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "roaa1",
      text: "Support",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
