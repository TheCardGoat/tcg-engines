import type { LocationCard } from "@tcg/lorcana-types";
import { theBayouMysteriousSwampI18n } from "./204-the-bayou-mysterious-swamp.i18n";

export const theBayouMysteriousSwamp: LocationCard = {
  id: "RGw",
  canonicalId: "ci_RGw",
  reprints: ["set3-204"],
  cardType: "location",
  name: "The Bayou",
  version: "Mysterious Swamp",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "003",
  cardNumber: 204,
  rarity: "uncommon",
  cost: 1,
  willpower: 3,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_65119a74cb394cec89eab4175ad228bf",
    tcgPlayer: 538683,
  },
  text: [
    {
      title: "SHOW ME THE WAY",
      description:
        "Whenever a character quests while here, you may draw a card, then choose and discard a card.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "2bw-1",
      name: "SHOW ME THE WAY",
      text: "SHOW ME THE WAY Whenever a character quests while here, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "quest",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theBayouMysteriousSwampI18n,
};
