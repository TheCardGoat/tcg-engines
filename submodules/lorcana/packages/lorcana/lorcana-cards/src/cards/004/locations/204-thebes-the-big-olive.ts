import type { LocationCard } from "@tcg/lorcana-types";
import { thebesTheBigOliveI18n } from "./204-thebes-the-big-olive.i18n";

export const thebesTheBigOlive: LocationCard = {
  id: "SOw",
  canonicalId: "ci_SOw",
  reprints: ["set4-204"],
  cardType: "location",
  name: "Thebes",
  version: "The Big Olive",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 204,
  rarity: "common",
  cost: 2,
  willpower: 7,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_d30e4b994223457c8b38bc696aa91e06",
    tcgPlayer: 549295,
  },
  text: [
    {
      title: "IF YOU CAN MAKE IT HERE...",
      description:
        "During your turn, whenever a character banishes another character in a challenge while here, gain 2 lore.",
    },
  ],
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "niw-1",
      name: "IF YOU CAN MAKE IT HERE...",
      text: "IF YOU CAN MAKE IT HERE... During your turn, whenever a character banishes another character in a challenge while here, gain 2 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: "CHARACTERS_HERE",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: thebesTheBigOliveI18n,
};
