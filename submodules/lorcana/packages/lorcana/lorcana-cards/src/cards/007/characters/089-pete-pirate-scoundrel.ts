import type { CharacterCard } from "@tcg/lorcana-types";
import { petePirateScoundrelI18n } from "./089-pete-pirate-scoundrel.i18n";

export const petePirateScoundrel: CharacterCard = {
  id: "4mp",
  canonicalId: "ci_4mp",
  reprints: ["set7-089"],
  cardType: "character",
  name: "Pete",
  version: "Pirate Scoundrel",
  inkType: ["emerald"],
  set: "007",
  cardNumber: 89,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6ff1b412a0b3492ea86308a9f41842b8",
    tcgPlayer: 618703,
  },
  text: [
    {
      title: "PILFER AND PLUNDER",
      description: "Whenever you play an action that isn't a song, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate"],
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
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1o3-1",
      name: "PILFER AND PLUNDER",
      text: "PILFER AND PLUNDER Whenever you play an action that isn't a song, you may banish chosen item.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
          excludeSong: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: petePirateScoundrelI18n,
};
