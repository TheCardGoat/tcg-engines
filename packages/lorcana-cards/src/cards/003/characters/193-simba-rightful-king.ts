import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaRightfulKing: CharacterCard = {
  id: "1nc",
  cardType: "character",
  name: "Simba",
  version: "Rightful King",
  fullName: "Simba - Rightful King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "003",
  text: "TRIUMPHANT STANCE During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 1,
  cardNumber: 193,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d5e96e3c5cf16c5011f1aa8018f87b668ff17dbf",
  },
  abilities: [
    {
      id: "1nc-1",
      type: "triggered",
      name: "TRIUMPHANT STANCE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
      text: "TRIUMPHANT STANCE During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "King"],
};
