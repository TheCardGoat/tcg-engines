import type { CharacterCard } from "@tcg/lorcana-types";

export const beastRelentless: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "8rn-1",
      name: "SECOND WIND",
      text: "SECOND WIND Whenever an opposing character is damaged, you may ready this character.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 70,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 6,
  externalIds: {
    ravensburger: "1f998b8d166c57c497364060cda6ba1cc7a4a1bf",
  },
  franchise: "Beauty and the Beast",
  fullName: "Beast - Relentless",
  id: "8rn",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Beast",
  set: "002",
  strength: 4,
  text: "SECOND WIND Whenever an opposing character is damaged, you may ready this character.",
  version: "Relentless",
  willpower: 5,
};
