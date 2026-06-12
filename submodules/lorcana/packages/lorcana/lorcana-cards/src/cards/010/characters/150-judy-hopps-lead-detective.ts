import type { CharacterCard } from "@tcg/lorcana-types";
import { judyHoppsLeadDetectiveI18n } from "./150-judy-hopps-lead-detective.i18n";

export const judyHoppsLeadDetective: CharacterCard = {
  id: "7DY",
  canonicalId: "ci_04m",
  reprints: ["set10-150"],
  cardType: "character",
  name: "Judy Hopps",
  version: "Lead Detective",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 150,
  rarity: "rare",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5413c96876fd4884861caaef3fcb58b5",
    tcgPlayer: 660043,
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "LATERAL THINKING",
      description:
        "During your turn, your Detective characters gain Alert and Resist +2. (They can challenge as if they had Evasive. Damage dealt to them is reduced by 2.)",
    },
  ],
  classifications: ["Floodborn", "Hero", "Detective"],
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1c8-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Alert",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Detective",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "1c8-2",
      name: "LATERAL THINKING",
      text: "LATERAL THINKING During your turn, your Detective characters gain Alert and Resist +2.",
      type: "static",
    },
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Resist",
        value: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Detective",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "1c8-3",
      name: "LATERAL THINKING",
      text: "LATERAL THINKING During your turn, your Detective characters gain Alert and Resist +2.",
      type: "static",
    },
  ],
  i18n: judyHoppsLeadDetectiveI18n,
};
