import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsOptimisticOfficer: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              target: {
                cardTypes: ["item"],
                count: 1,
                owner: "any",
                selector: "chosen",
                zones: ["play"],
              },
              type: "banish",
            },
            type: "optional",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "142-1",
      name: "DON'T CALL ME CUTE",
      text: "DON'T CALL ME CUTE When you play this character, you may banish chosen item. If you do, its player draws a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
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
