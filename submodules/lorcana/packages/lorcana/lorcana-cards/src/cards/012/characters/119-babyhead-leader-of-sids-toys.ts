import type { CharacterCard } from "@tcg/lorcana-types";
import { babyheadLeaderOfSidsToysI18n } from "./119-babyhead-leader-of-sids-toys.i18n";

export const babyheadLeaderOfSidsToys: CharacterCard = {
  id: "IrS",
  canonicalId: "ci_IrS",
  reprints: ["set12-119"],
  cardType: "character",
  name: "Babyhead",
  version: "Leader of Sid's Toys",
  inkType: ["ruby"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 119,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_e8e7a7e2380f456887bb6b8f01f991b1",
  },
  text: [
    {
      title: "Tighten the Bolts",
      description:
        "Whenever you pay 2 {I} or less to play a card, chosen character gets +2 {S} this turn.",
    },
    {
      title: "Replacement Parts",
      description:
        "During your turn, whenever one of your other characters is banished, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      id: "IrS-1",
      name: "Tighten the Bolts",
      type: "triggered",
      text: "Tighten the Bolts Whenever you pay 2 {I} or less to play a card, chosen character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
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
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        duration: "this-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
      },
    },
    {
      id: "IrS-2",
      name: "Replacement Parts",
      type: "triggered",
      text: "Replacement Parts During your turn, whenever one of your other characters is banished, draw a card.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "draw",
        amount: 1,
      },
    },
  ],
  i18n: babyheadLeaderOfSidsToysI18n,
};
