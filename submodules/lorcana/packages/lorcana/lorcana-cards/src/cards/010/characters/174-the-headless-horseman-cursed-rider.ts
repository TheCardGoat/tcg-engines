import type { CharacterCard } from "@tcg/lorcana-types";
import { theHeadlessHorsemanCursedRiderI18n } from "./174-the-headless-horseman-cursed-rider.i18n";

export const theHeadlessHorsemanCursedRider: CharacterCard = {
  id: "OVf",
  canonicalId: "ci_OVf",
  slug: "lorcana-ci_OVf",
  printings: [
    {
      id: "set10-174",
      artId: "set10-174",
      setCode: "set10",
      collectorNumber: "174",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set10-174"],
  cardType: "character",
  name: "The Headless Horseman",
  version: "Cursed Rider",
  inkType: ["steel"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 174,
  rarity: "common",
  cost: 8,
  strength: 5,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f64c2b670af947f8bca5f1ce7a5a88d9",
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "WITCHING HOUR",
      description:
        "When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1xu-1",
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    {
      effect: {
        steps: [
          {
            amount: 3,
            target: "EACH_PLAYER",
            type: "draw",
          },
          {
            amount: 3,
            target: "EACH_PLAYER",
            random: true,
            type: "discard",
          },
          {
            type: "count",
            what: "discarded-action-cards",
            multiplier: 2,
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              amount: {
                type: "trigger-amount",
              },
              target: {
                selector: "chosen",
                count: 1,
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
              type: "deal-damage",
            },
          },
        ],
        type: "sequence",
      },
      id: "1xu-2",
      name: "WITCHING HOUR",
      text: "WITCHING HOUR When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: theHeadlessHorsemanCursedRiderI18n,
};
