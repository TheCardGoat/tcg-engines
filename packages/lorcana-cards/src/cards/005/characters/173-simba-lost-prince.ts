import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaLostPrince: CharacterCard = {
  id: "1e1",
  cardType: "character",
  name: "Simba",
  version: "Lost Prince",
  fullName: "Simba - Lost Prince",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "005",
  text: "FACE THE PAST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 173,
  inkable: true,
  externalIds: {
    ravensburger: "b66d745358da7ec9b30e05117dd8f73ea6ae5746",
  },
  abilities: [
    {
      id: "1e1-1",
      name: "FACE THE PAST",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
