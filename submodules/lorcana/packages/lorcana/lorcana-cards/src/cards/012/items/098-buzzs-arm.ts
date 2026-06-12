import type { ItemCard } from "@tcg/lorcana-types";
import { buzzsArmI18n } from "./098-buzzs-arm.i18n";

export const buzzsArm: ItemCard = {
  id: "XEC",
  canonicalId: "ci_XEC",
  reprints: ["set12-098"],
  cardType: "item",
  name: "Buzz's Arm",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 98,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_eb78022ded274a99bea1f50570755b37",
  },
  text: [
    {
      title: "MISSING PIECE",
      description:
        "If a character named Buzz Lightyear was banished this turn, you may play this item for free.",
    },
    {
      title: "SOME ASSEMBLY REQUIRED",
      description: "{E} — You pay 1 {I} less for the next action or item you play this turn.",
    },
  ],
  abilities: [
    {
      id: "XEC-1",
      name: "MISSING PIECE",
      type: "static",
      sourceZones: ["hand"],
      condition: {
        type: "turn-metric",
        metric: "banished-characters",
        name: "Buzz Lightyear",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "cost-reduction",
        amount: "full",
      },
      text: "MISSING PIECE If a character named Buzz Lightyear was banished this turn, you may play this item for free.",
    },
    {
      id: "XEC-2",
      name: "SOME ASSEMBLY REQUIRED",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: ["action", "item"],
        duration: "next-play-this-turn",
        target: "CONTROLLER",
      },
      text: "SOME ASSEMBLY REQUIRED {E} — You pay 1 {I} less for the next action or item you play this turn.",
    },
  ],
  i18n: buzzsArmI18n,
};
