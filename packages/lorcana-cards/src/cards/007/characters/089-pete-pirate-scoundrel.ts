import type { CharacterCard } from "@tcg/lorcana-types";

export const petePirateScoundrel: CharacterCard = {
  id: "1o3",
  cardType: "character",
  name: "Pete",
  version: "Pirate Scoundrel",
  fullName: "Pete - Pirate Scoundrel",
  inkType: ["emerald"],
  set: "007",
  text: "PILFER AND PLUNDER Whenever you play an action that isn't a song, you may banish chosen item.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 89,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d89b25a8952e36576cfdd04557b3a45e0ca9dc07",
  },
  abilities: [
    {
      id: "1o3-1",
      type: "triggered",
      name: "PILFER AND PLUNDER",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
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
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "PILFER AND PLUNDER Whenever you play an action that isn't a song, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate"],
};
