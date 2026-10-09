import type { CharacterCard } from "@tcg/lorcana-types";
import { buzzLightyearOnTheWayP3PromoI18n } from "./p3-056-buzz-lightyear-on-the-way-promo.i18n";

export const buzzLightyearOnTheWayP3Promo: CharacterCard = {
  id: "O3U",
  canonicalId: "ci_xen",
  slug: "lorcana-ci_xen",
  printings: [
    {
      id: "set12-p3-056-promo",
      artId: "ci_xen-promo",
      setCode: "set12",
      collectorNumber: "56",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set12-085"],
  cardType: "character",
  name: "Buzz Lightyear",
  version: "On the Way",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 56,
  rarity: "special",
  specialRarity: "promo",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e2c38bf30c48489f914581f55acd67fb",
    tcgPlayer: "678236",
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
  i18n: buzzLightyearOnTheWayP3PromoI18n,
};
