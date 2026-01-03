import type { CharacterCard } from "@tcg/lorcana-types";

export const PrincePhillipDragonslayer: CharacterCard = {
  id: "u23",
  cardType: "character",
  name: "Prince Phillip",
  version: "Dragonslayer",
  fullName: "Prince Phillip - Dragonslayer",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "**HEROISM** When this character challenges and is banished, you may banish the challenged character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 16,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "c7p-1",
      text: "**DRAGON SLAYER** When you play this character, you may banish chosen character.",
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
    },
  ],
  classifications: ["Hero", "Storyborn", "Prince"],
};
