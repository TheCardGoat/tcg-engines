import type { CharacterCard } from "@tcg/lorcana-types";

export const treasureGuardianForebodingSentry: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have an Illusion character in play",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "conditional",
      },
      id: "9vb-1",
      name: "UNTOLD TREASURE",
      text: "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 47,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 4,
  externalIds: {
    ravensburger: "239268271716f479ba115fea202b33efe3854e73",
  },
  franchise: "Aladdin",
  fullName: "Treasure Guardian - Foreboding Sentry",
  id: "9vb",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Treasure Guardian",
  set: "007",
  strength: 3,
  text: "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.",
  version: "Foreboding Sentry",
  willpower: 3,
};
