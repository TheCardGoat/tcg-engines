import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaRightfulKing: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "1nc-1",
      name: "TRIUMPHANT STANCE",
      text: "TRIUMPHANT STANCE During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 193,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "King"],
  cost: 5,
  externalIds: {
    ravensburger: "d5e96e3c5cf16c5011f1aa8018f87b668ff17dbf",
  },
  franchise: "Lion King",
  fullName: "Simba - Rightful King",
  id: "1nc",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Simba",
  set: "003",
  strength: 4,
  text: "TRIUMPHANT STANCE During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.",
  version: "Rightful King",
  willpower: 6,
};
