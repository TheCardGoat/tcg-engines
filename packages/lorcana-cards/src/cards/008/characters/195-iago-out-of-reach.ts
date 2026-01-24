import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoOutOfReach: CharacterCard = {
  id: "9cu",
  cardType: "character",
  name: "Iago",
  version: "Out of Reach",
  fullName: "Iago - Out of Reach",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "008",
  text: "SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 195,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "21b8caf084ceffd01eb6823459d541ea9f8ba4de",
  },
  abilities: [
    {
      id: "9cu-1",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      text: "SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
