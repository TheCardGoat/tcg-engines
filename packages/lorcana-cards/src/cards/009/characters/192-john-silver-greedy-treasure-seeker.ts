import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverGreedyTreasureSeeker: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            target: "SELF",
            value: 1,
          },
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
      id: "jy5-1",
      text: "CHART YOUR OWN COURSE For each location you have in play, this character gains Resist +1 and gets +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Alien", "Pirate", "Captain"],
  cost: 3,
  externalIds: {
    ravensburger: "47e5c25af32615987611612bbee8871f3cb76552",
  },
  franchise: "Treasure Planet",
  fullName: "John Silver - Greedy Treasure Seeker",
  id: "jy5",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "John Silver",
  set: "009",
  strength: 3,
  text: "CHART YOUR OWN COURSE For each location you have in play, this character gains Resist +1 and gets +1 {L}. (Damage dealt to them is reduced by 1.)",
  version: "Greedy Treasure Seeker",
  willpower: 3,
};
