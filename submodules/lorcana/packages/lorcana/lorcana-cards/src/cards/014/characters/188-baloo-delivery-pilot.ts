import type { CharacterCard } from "@tcg/lorcana-types";
import { balooDeliveryPilotI18n } from "./188-baloo-delivery-pilot.i18n";

export const balooDeliveryPilot: CharacterCard = {
  id: "EmK",
  canonicalId: "ci_EmK",
  slug: "lorcana-ci_EmK",
  printings: [
    {
      id: "set14-188",
      artId: "set14-188",
      setCode: "set14",
      collectorNumber: "188",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-188"],
  cardType: "character",
  name: "Baloo",
  version: "Delivery Pilot",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 188,
  rarity: "uncommon",
  cost: 2,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Payment Up Front",
      description: "This character can't quest or challenge unless you got an ink drop this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Captain"],
  abilities: [
    {
      id: "baloo-1",
      name: "Payment Up Front",
      type: "static",
      text: "Payment Up Front This character can't quest or challenge unless you got an ink drop this turn.",
      condition: {
        type: "not",
        condition: {
          type: "turn-metric",
          metric: "ink-drops-gained",
          playerScope: "you",
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
      },
      effect: {
        type: "restriction",
        restriction: "cant-quest-or-challenge",
        target: "SELF",
      },
    },
  ],
  i18n: balooDeliveryPilotI18n,
};
