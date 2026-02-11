import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsOptimisticOfficer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
            chooser: "CONTROLLER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      id: "142-1",
      name: "DON'T CALL ME CUTE",
      text: "DON'T CALL ME CUTE When you play this character, you may banish chosen item. If you do, its player draws a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 157,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "939cd97703bd3991f17d78942c5d5c9e4db17b28",
  },
  franchise: "Zootropolis",
  fullName: "Judy Hopps - Optimistic Officer",
  id: "142",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Judy Hopps",
  set: "009",
  strength: 2,
  text: "DON'T CALL ME CUTE When you play this character, you may banish chosen item. If you do, its player draws a card.",
  version: "Optimistic Officer",
  willpower: 3,
};
