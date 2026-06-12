import type { CharacterCard } from "@tcg/lorcana-types";
import { kitCloudkickerToughGuyI18n } from "./077-kit-cloudkicker-tough-guy.i18n";

export const kitCloudkickerToughGuy: CharacterCard = {
  id: "th7",
  canonicalId: "ci_th7",
  reprints: ["set3-077"],
  cardType: "character",
  name: "Kit Cloudkicker",
  version: "Tough Guy",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "003",
  cardNumber: 77,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e672bba7d4c5402f82d9360fca1594f5",
    tcgPlayer: 538357,
  },
  text: [
    {
      title: "SKYSURFING",
      description:
        "When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "strength-comparison",
                comparison: "or-less",
                value: 2,
              },
            ],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "c40-1",
      name: "SKYSURFING",
      text: "SKYSURFING When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kitCloudkickerToughGuyI18n,
};
