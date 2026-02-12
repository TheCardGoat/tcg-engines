import type { CharacterCard } from "@tcg/lorcana-types";

export const mufasaBetrayedLeader: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "it's a character card",
        },
        then: {
          type: "restriction",
          restriction: "enters-play-exerted",
          target: "SELF",
        },
        type: "conditional",
      },
      id: "rn8-1",
      name: "THE SUN WILL SET",
      text: "THE SUN WILL SET When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 14,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "King"],
  cost: 5,
  externalIds: {
    ravensburger: "63a29aa0ab62842bfd36595e8ed690cfdc1ed928",
  },
  franchise: "Lion King",
  fullName: "Mufasa - Betrayed Leader",
  id: "rn8",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Mufasa",
  set: "002",
  strength: 3,
  text: "THE SUN WILL SET When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.",
  version: "Betrayed Leader",
  willpower: 3,
};
