import type { CharacterCard } from "@tcg/lorcana-types";

export const madHatterGraciousHost: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "hej-1",
      name: "TEA PARTY",
      text: "TEA PARTY Whenever this character is challenged, you may draw a card.",
      trigger: {
        event: "challenged",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 86,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 5,
  externalIds: {
    ravensburger: "3eb9c2ef04530dc057f7085a82915ead29d51e4d",
  },
  franchise: "Alice in Wonderland",
  fullName: "Mad Hatter - Gracious Host",
  id: "hej",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  name: "Mad Hatter",
  set: "001",
  strength: 2,
  text: "TEA PARTY Whenever this character is challenged, you may draw a card.",
  version: "Gracious Host",
  willpower: 4,
};
