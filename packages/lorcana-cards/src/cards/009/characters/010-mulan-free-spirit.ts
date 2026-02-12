import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanFreeSpirit: CharacterCard = {
  abilities: [
    {
      id: "roa-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 10,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "63be0c9e418d5a0329a87de4082802d18848efe6",
  },
  franchise: "Mulan",
  fullName: "Mulan - Free Spirit",
  id: "roa",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Mulan",
  set: "009",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Free Spirit",
  willpower: 3,
};
