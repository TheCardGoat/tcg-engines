import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "continuous",
    effects: [
      {
        type: "keyword",
        keyword: "Blocker",
      },
    ],
    text: "<Blocker>",
  },
  {
    type: "triggered",
    effects: [
      {
        type: "rule",
        ruleText: "Earth Alliance",
        originalText: "(Earth Alliance)",
      },
      {
        type: "rule",
        ruleText: "(Earth Alliance",
        originalText: "((Earth Alliance)",
      },
    ],
    trigger: {
      event: "burst",
    },
    text: "【burst】",
  },
];

export const strikerPack: GundamitoCommandCard = {
  id: "ST04-012",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 12,
  name: "Striker Pack",
  color: "white",
  set: "ST04",
  rarity: "common",
  type: "command",
  text: "【Burst】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Aile Strike Gundam]((Earth Alliance)･AP3･HP3･&lt;Blocker&gt;) Unit token.",
  abilities: abilities,
};
