import type { CharacterCard } from "@tcg/lorcana-types";
import { aliceCourageousKeyholderI18n } from "./127-alice-courageous-keyholder.i18n";

export const aliceCourageousKeyholder: CharacterCard = {
  id: "x8u",
  canonicalId: "ci_x8u",
  reprints: ["set8-127"],
  cardType: "character",
  name: "Alice",
  version: "Courageous Keyholder",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "008",
  cardNumber: 127,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_4269fd204f144eb4b5044df82a899bd1",
    tcgPlayer: 631433,
  },
  text: [
    {
      title: "THIS WAY OUT",
      description:
        "When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "status",
                    status: "damaged",
                  },
                ],
              },
              type: "ready",
            },
            {
              duration: "this-turn",
              restriction: "cant-quest",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "status",
                    status: "damaged",
                  },
                ],
              },
              type: "restriction",
            },
          ],
        },
        type: "optional",
      },
      id: "65f-1",
      name: "THIS WAY OUT",
      text: "THIS WAY OUT When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: aliceCourageousKeyholderI18n,
};
