import type { ItemCard } from "@tcg/lorcana-types";
import { infrapinkUltraScanSpecsI18n } from "./201-infra-pink-ultra-scan-specs.i18n";

export const infrapinkUltraScanSpecs: ItemCard = {
  id: "nZg",
  canonicalId: "ci_nZg",
  reprints: ["set11-201"],
  cardType: "item",
  name: "Infra-Pink Ultra Scan Specs",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 201,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_472838feca334c31913db3f2fc0b39db",
    tcgPlayer: 676249,
  },
  text: [
    {
      title: "DETECTING EVIDENCE",
      description: "When you play this item, draw a card, then choose and discard a card.",
    },
    {
      title: "FOLLOW THE CLUES",
      description:
        "Banish this item — Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
    },
  ],
  abilities: [
    {
      id: "1b9-1",
      name: "DETECTING EVIDENCE",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
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
            chosen: true,
            target: "CONTROLLER",
          },
        ],
      },
      text: "DETECTING EVIDENCE When you play this item, draw a card, then choose and discard a card.",
    },
    {
      id: "1b9-2",
      name: "FOLLOW THE CLUES",
      type: "activated",
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Alert",
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "FOLLOW THE CLUES Banish this item — Chosen character gains Alert this turn.",
    },
  ],
  i18n: infrapinkUltraScanSpecsI18n,
};
