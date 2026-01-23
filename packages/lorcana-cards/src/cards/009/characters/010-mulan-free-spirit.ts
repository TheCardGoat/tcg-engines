import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanFreeSpirit: CharacterCard = {
  id: "roa",
  cardType: "character",
  name: "Mulan",
  version: "Free Spirit",
  fullName: "Mulan - Free Spirit",
  inkType: ["amber"],
  franchise: "Mulan",
  set: "009",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 10,
  inkable: true,
  externalIds: {
    ravensburger: "63be0c9e418d5a0329a87de4082802d18848efe6",
  },
  abilities: [
    {
      id: "roa-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
