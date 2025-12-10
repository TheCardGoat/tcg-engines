import type { CharacterCard } from "@tcg/lorcana";

export const treasureGuardianForebodingSentry: CharacterCard = {
  id: "9vb",
  cardType: "character",
  name: "Treasure Guardian",
  version: "Foreboding Sentry",
  fullName: "Treasure Guardian - Foreboding Sentry",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "007",
  text: "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 47,
  inkable: true,
  externalIds: {
    ravensburger: "239268271716f479ba115fea202b33efe3854e73",
  },
  abilities: [
    {
      id: "9vb-1",
      text: "UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.",
      name: "UNTOLD TREASURE",
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
  classifications: ["Storyborn"],
};
