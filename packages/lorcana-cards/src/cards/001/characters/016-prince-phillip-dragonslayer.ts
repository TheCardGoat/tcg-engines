import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipDragonslayer: CharacterCard = {
  id: "152",
  cardType: "character",
  name: "Prince Phillip",
  version: "Dragonslayer",
  fullName: "Prince Phillip - Dragonslayer",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "001",
  text: "HEROISM When this character challenges and is banished, you may banish the challenged character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 16,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9597388eb1ea9c907abbbf2dda9fea8216bc575b",
  },
  abilities: [
    {
      id: "152-1",
      type: "triggered",
      name: "HEROISM",
      trigger: {
        event: "challenge",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "HEROISM When this character challenges and is banished, you may banish the challenged character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
