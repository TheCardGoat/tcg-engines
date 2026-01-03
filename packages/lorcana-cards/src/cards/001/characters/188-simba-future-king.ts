import type { CharacterCard } from "@tcg/lorcana-types";

export const SimbaFutureKing: CharacterCard = {
  id: "q21",
  cardType: "character",
  name: "Simba",
  version: "Future King",
  fullName: "Simba - Future King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "001",
  text: "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 188,
  inkable: true,
  externalIds: {
    ravensburger: "5de9049716db6093e203ad3ba87b04894b400848",
  },
  abilities: [
    {
      id: "q21-1",
      text: "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card.",
      name: "GUESS WHAT?",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
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
