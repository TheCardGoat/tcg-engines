import type { CharacterCard } from "@tcg/lorcana-types";

export const chifuImperialAdvisor: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "m5z-1",
      text: "OVERLY CAUTIOUS While this character has no damage, he gets +2 {L}.",
      type: "static",
    },
  ],
  cardNumber: 177,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "4fe35d3556761c5dcb31d03ea92e405eb1f8c27e",
  },
  franchise: "Mulan",
  fullName: "Chi-Fu - Imperial Advisor",
  id: "m5z",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Chi-Fu",
  set: "004",
  strength: 0,
  text: "OVERLY CAUTIOUS While this character has no damage, he gets +2 {L}.",
  version: "Imperial Advisor",
  willpower: 5,
};
