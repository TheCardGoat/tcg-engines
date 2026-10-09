import type { LocationCard } from "@tcg/lorcana-types";
import { landOfTheDeadMarigoldBridgeI18n } from "./135-land-of-the-dead-marigold-bridge.i18n";

export const landOfTheDeadMarigoldBridge: LocationCard = {
  id: "6s8",
  canonicalId: "ci_6s8",
  slug: "lorcana-ci_6s8",
  printings: [
    {
      id: "set14-135",
      artId: "set14-135",
      setCode: "set14",
      collectorNumber: "135",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-135"],
  cardType: "location",
  name: "Land of the Dead",
  version: "Marigold Bridge",
  inkType: ["ruby"],
  franchise: "Coco",
  set: "014",
  cardNumber: 135,
  rarity: "uncommon",
  cost: 4,
  willpower: 8,
  moveCost: 1,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Honored Offerings",
      description: "While you have 10 or more cards in your discard, this location gets +2 {L}.",
    },
  ],
  abilities: [
    {
      id: "6s8-1",
      name: "Honored Offerings",
      text: "Honored Offerings While you have 10 or more cards in your discard, this location gets +2 {L}.",
      type: "static",
      condition: {
        type: "resource-count",
        what: "cards-in-discard",
        controller: "you",
        comparison: "greater-or-equal",
        value: 10,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: landOfTheDeadMarigoldBridgeI18n,
};
