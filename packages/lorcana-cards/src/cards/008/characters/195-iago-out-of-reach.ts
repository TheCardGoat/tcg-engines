import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoOutOfReach: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      id: "9cu-1",
      text: "SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.",
      type: "action",
    },
  ],
  cardNumber: 195,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "21b8caf084ceffd01eb6823459d541ea9f8ba4de",
  },
  franchise: "Aladdin",
  fullName: "Iago - Out of Reach",
  id: "9cu",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Iago",
  set: "008",
  strength: 3,
  text: "SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.",
  version: "Out of Reach",
  willpower: 3,
};
