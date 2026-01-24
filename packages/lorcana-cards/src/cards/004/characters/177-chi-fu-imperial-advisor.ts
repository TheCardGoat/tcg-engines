import type { CharacterCard } from "@tcg/lorcana-types";

export const chifuImperialAdvisor: CharacterCard = {
  id: "m5z",
  cardType: "character",
  name: "Chi-Fu",
  version: "Imperial Advisor",
  fullName: "Chi-Fu - Imperial Advisor",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "OVERLY CAUTIOUS While this character has no damage, he gets +2 {L}.",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 1,
  cardNumber: 177,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4fe35d3556761c5dcb31d03ea92e405eb1f8c27e",
  },
  abilities: [
    {
      id: "m5z-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      text: "OVERLY CAUTIOUS While this character has no damage, he gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
