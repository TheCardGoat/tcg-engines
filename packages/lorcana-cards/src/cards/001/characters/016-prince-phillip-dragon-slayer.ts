import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipDragonSlayer: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "c7p-1",
      text: "**DRAGON SLAYER** When you play this character, you may banish chosen character.",
      type: "action",
    },
  ],
  cardNumber: 16,
  cardType: "character",
  classifications: ["Hero", "Storyborn", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Prince Phillip - Dragonslayer",
  id: "u23",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Prince Phillip",
  set: "001",
  strength: 3,
  text: "**HEROISM** When this character challenges and is banished, you may banish the challenged character.",
  version: "Dragonslayer",
  willpower: 3,
};
