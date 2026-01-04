import type { CharacterCard } from "@tcg/lorcana-types";

export const madHattergraciousHost: CharacterCard = {
  id: "hej",
  cardType: "character",
  name: "Mad Hatter",
  version: "Gracious Host",
  fullName: "Mad Hatter - Gracious Host",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "001",
  text: "TEA PARTY Whenever this character is challenged, you may draw a card.",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 3,
  cardNumber: 86,
  inkable: true,
  externalIds: {
    ravensburger: "3eb9c2ef04530dc057f7085a82915ead29d51e4d",
  },
  abilities: [
    {
      id: "hej-1",
      name: "TEA PARTY",
      text: "TEA PARTY Whenever this character is challenged, you may draw a card.",
      type: "triggered",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
        defender: {
          filters: [{ type: "source", ref: "self" }],
        },
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
  classifications: ["Storyborn"],
};
