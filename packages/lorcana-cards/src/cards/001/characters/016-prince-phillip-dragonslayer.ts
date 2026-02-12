import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipDragonslayer: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "152-1",
      name: "HEROISM",
      text: "HEROISM When this character challenges and is banished, you may banish the challenged character.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 16,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "9597388eb1ea9c907abbbf2dda9fea8216bc575b",
  },
  franchise: "Sleeping Beauty",
  fullName: "Prince Phillip - Dragonslayer",
  id: "152",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Prince Phillip",
  set: "001",
  strength: 3,
  text: "HEROISM When this character challenges and is banished, you may banish the challenged character.",
  version: "Dragonslayer",
  willpower: 3,
};
