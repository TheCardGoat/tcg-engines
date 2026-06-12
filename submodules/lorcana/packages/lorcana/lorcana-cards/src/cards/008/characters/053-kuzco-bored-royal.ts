import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoBoredRoyalI18n } from "./053-kuzco-bored-royal.i18n";

export const kuzcoBoredRoyal: CharacterCard = {
  id: "AdI",
  canonicalId: "ci_AdI",
  reprints: ["set8-053"],
  cardType: "character",
  name: "Kuzco",
  version: "Bored Royal",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "008",
  cardNumber: 53,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5508d787ca204fdcbba52a26d7258301",
    tcgPlayer: 631387,
  },
  text: [
    {
      title: "LLAMA BREATH",
      description:
        "When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "King"],
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
            cardTypes: ["character", "item", "location"],
            filter: [
              {
                type: "cost-comparison",
                comparison: "less-or-equal",
                value: 2,
              },
            ],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "p9g-1",
      name: "LLAMA BREATH",
      text: "LLAMA BREATH When you play this character, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kuzcoBoredRoyalI18n,
};
