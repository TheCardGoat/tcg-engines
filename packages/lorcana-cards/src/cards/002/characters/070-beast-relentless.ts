import type { CharacterCard } from "@tcg/lorcana-types";

export const beastRelentless: CharacterCard = {
  id: "8rn",
  cardType: "character",
  name: "Beast",
  version: "Relentless",
  fullName: "Beast - Relentless",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "SECOND WIND Whenever an opposing character is damaged, you may ready this character.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 70,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1f998b8d166c57c497364060cda6ba1cc7a4a1bf",
  },
  abilities: [
    {
      id: "8rn-1",
      type: "triggered",
      name: "SECOND WIND",
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "SECOND WIND Whenever an opposing character is damaged, you may ready this character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
