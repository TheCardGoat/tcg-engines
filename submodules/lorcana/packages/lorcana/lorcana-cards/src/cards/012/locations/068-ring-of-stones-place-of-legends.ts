import type { LocationCard } from "@tcg/lorcana-types";
import { ringOfStonesPlaceOfLegendsI18n } from "./068-ring-of-stones-place-of-legends.i18n";

export const ringOfStonesPlaceOfLegends: LocationCard = {
  id: "EaV",
  canonicalId: "ci_EaV",
  reprints: ["set12-068"],
  cardType: "location",
  name: "Ring of Stones",
  version: "Place of Legends",
  inkType: ["amethyst"],
  franchise: "Brave",
  set: "012",
  cardNumber: 68,
  rarity: "rare",
  cost: 4,
  willpower: 7,
  moveCost: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7a5bbd2bed1b4b109511ea5bcd384252",
  },
  text: [
    {
      title: "FOLLOW YOUR FATE",
      description: "Your exerted characters can move here for free.",
    },
    {
      title: "PART THE VEIL",
      description: "Once during your turn, whenever a character moves here, gain 1 lore.",
    },
  ],
  abilities: [
    {
      id: "EaV-1",
      name: "FOLLOW YOUR FATE",
      text: "FOLLOW YOUR FATE Your exerted characters can move here for free.",
      type: "static",
      effect: {
        type: "move-cost-reduction",
        reduction: "free",
        location: "here",
        filters: [
          {
            type: "exerted",
          },
        ],
      },
    },
    {
      id: "EaV-2",
      name: "PART THE VEIL",
      text: "PART THE VEIL Once during your turn, whenever a character moves here, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "move",
        on: "CHARACTERS_HERE",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: ringOfStonesPlaceOfLegendsI18n,
};
