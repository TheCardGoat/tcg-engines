import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaLostPrince: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      id: "1e1-1",
      name: "FACE THE PAST",
      text: "FACE THE PAST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 173,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "b66d745358da7ec9b30e05117dd8f73ea6ae5746",
  },
  franchise: "Lion King",
  fullName: "Simba - Lost Prince",
  id: "1e1",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Simba",
  set: "005",
  strength: 2,
  text: "FACE THE PAST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  version: "Lost Prince",
  willpower: 4,
};
