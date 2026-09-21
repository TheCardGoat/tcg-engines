import type { StageCard } from "@tcg/op-types";
import { op15DressrosaKingdom057I18n } from "./op15-057-dressrosa-kingdom.i18n.ts";

export const op15DressrosaKingdom057: StageCard = {
  id: "OP15-057",
  canonicalId: "OP15-057",
  slug: "dressrosa-kingdom/op15-057",
  name: "Dressrosa Kingdom",
  printings: [
    {
      id: "OP15-057",
      artId: "OP15-057",
      setCode: "OP15",
      collectorNumber: "057",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-057_GtvhioW.jpg",
    },
  ],
  cardType: "stage",
  color: ["blue"],
  rarity: "C",
  setId: "OP15",
  cost: 1,
  traits: ["Dressrosa"],
  effect:
    "[On Play] If your Leader has the {Dressrosa} type, draw 1 card.\n[On Your Opponent's Attack] You may rest this Stage and trash 1 Event or Stage card from your hand: Up to 1 of your Leader or Character cards gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Dressrosa",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op15DressrosaKingdom057I18n,
};
