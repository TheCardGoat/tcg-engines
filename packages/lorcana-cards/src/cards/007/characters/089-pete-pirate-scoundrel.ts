import type { CharacterCard } from "@tcg/lorcana-types";

export const petePirateScoundrel: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "1o3-1",
      name: "PILFER AND PLUNDER",
      text: "PILFER AND PLUNDER Whenever you play an action that isn't a song, you may banish chosen item.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "action",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 89,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Pirate"],
  cost: 1,
  externalIds: {
    ravensburger: "d89b25a8952e36576cfdd04557b3a45e0ca9dc07",
  },
  fullName: "Pete - Pirate Scoundrel",
  id: "1o3",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pete",
  set: "007",
  strength: 1,
  text: "PILFER AND PLUNDER Whenever you play an action that isn't a song, you may banish chosen item.",
  version: "Pirate Scoundrel",
  willpower: 2,
};
