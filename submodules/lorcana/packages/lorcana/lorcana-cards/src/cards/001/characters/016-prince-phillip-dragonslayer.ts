import type { CharacterCard } from "@tcg/lorcana-types";
import { princePhillipDragonslayerI18n } from "./016-prince-phillip-dragonslayer.i18n";

export const princePhillipDragonslayer: CharacterCard = {
  id: "0Xn",
  canonicalId: "ci_0Xn",
  reprints: ["set1-016"],
  cardType: "character",
  name: "Prince Phillip",
  version: "Dragonslayer",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 16,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f1e67c29942c408daaa683520972e1ea",
    tcgPlayer: 505946,
  },
  text: [
    {
      title: "HEROISM",
      description:
        "When this character challenges and is banished, you may banish the challenged character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: { ref: "defender" },
          type: "banish",
        },
        type: "optional",
      },
      id: "152-1",
      name: "HEROISM",
      text: "HEROISM When this character challenges and is banished, you may banish the challenged character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [{ type: "in-challenge" }],
      },
      type: "triggered",
    },
  ],
  i18n: princePhillipDragonslayerI18n,
};
