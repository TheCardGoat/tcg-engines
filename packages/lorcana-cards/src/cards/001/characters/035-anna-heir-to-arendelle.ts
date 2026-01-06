import type { CharacterCard } from "@tcg/lorcana-types";

export const annaHeirToArendelle: CharacterCard = {
  id: "ibd",
  cardType: "character",
  name: "Anna",
  version: "Heir to Arendelle",
  fullName: "Anna - Heir to Arendelle",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  text: "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 35,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      id: "ibd-1",
      type: "triggered",
      name: "LOVING HEART",
      text: "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      condition: {
        type: "has-named-character",
        name: "Elsa",
        controller: "you",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        duration: "next-turn",
        target: {
          selector: "chosen",
          count: 1,
          controller: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  classifications: ["Hero", "Queen", "Storyborn"],
};
