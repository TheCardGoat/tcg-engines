import type { CharacterCard } from "@tcg/lorcana-types";
import { buzzLightyearOnTheWayI18n } from "./085-buzz-lightyear-on-the-way.i18n";

export const buzzLightyearOnTheWay: CharacterCard = {
  id: "xen",
  canonicalId: "ci_xen",
  reprints: ["set12-085"],
  cardType: "character",
  name: "Buzz Lightyear",
  version: "On the Way",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 85,
  rarity: "rare",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e2c38bf30c48489f914581f55acd67fb",
  },
  text: [
    {
      title: "SECRET MISSION",
      description:
        "Whenever you pay 2 {I} or less to play a non-character, draw a card, then choose and discard a card.",
    },
    {
      title: "WORLD'S GREATEST TOY",
      description:
        "Whenever you pay 2 {I} or less to play a character, deal 1 damage to chosen opposing damaged character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Toy", "Captain"],
  abilities: [
    {
      id: "xen-1",
      name: "SECRET MISSION",
      type: "triggered",
      text: "SECRET MISSION Whenever you pay 2 {I} or less to play a non-character, draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: ["action", "item", "location"],
          filters: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 2,
              costSource: "paid",
            },
          ],
        },
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
    },
    {
      id: "xen-2",
      name: "WORLD'S GREATEST TOY",
      type: "triggered",
      text: "WORLD'S GREATEST TOY Whenever you pay 2 {I} or less to play a character, deal 1 damage to chosen opposing damaged character.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          filters: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 2,
              costSource: "paid",
            },
          ],
        },
        timing: "whenever",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "CHOSEN_DAMAGED_OPPOSING_CHARACTER",
      },
    },
  ],
  i18n: buzzLightyearOnTheWayI18n,
};
