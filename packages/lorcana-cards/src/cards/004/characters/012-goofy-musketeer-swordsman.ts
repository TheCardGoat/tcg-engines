import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyMusketeerSwordsman: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            cardType: "character",
            from: "hand",
            type: "play-card",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "1k3-1",
      name: "EN GAWRSH!",
      text: "EN GAWRSH! Whenever you play a character with Bodyguard, ready this character. He can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 12,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  cost: 4,
  externalIds: {
    ravensburger: "ca42513da10e6a1b0440802af06612135a6a54df",
  },
  fullName: "Goofy - Musketeer Swordsman",
  id: "1k3",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Goofy",
  set: "004",
  strength: 3,
  text: "EN GAWRSH! Whenever you play a character with Bodyguard, ready this character. He can't quest for the rest of this turn.",
  version: "Musketeer Swordsman",
  willpower: 4,
};
