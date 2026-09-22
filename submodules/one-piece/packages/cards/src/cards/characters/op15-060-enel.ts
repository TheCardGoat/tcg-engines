import type { CharacterCard } from "@tcg/op-types";
import { op15Enel060I18n } from "./op15-060-enel.i18n.ts";

export const op15Enel060: CharacterCard = {
  id: "OP15-060",
  canonicalId: "OP15-060",
  slug: "enel/op15-060",
  name: "Enel",
  printings: [
    {
      id: "OP15-060",
      artId: "OP15-060",
      setCode: "OP15",
      collectorNumber: "060",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-060_sR1j434.jpg",
      label: "Enel (OP15-060)",
    },
    {
      id: "OP15-060_p1",
      artId: "OP15-060_p1",
      setCode: "OP15",
      collectorNumber: "060",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-060_p1_gZ1XXGE.jpg",
      label: "Enel (OP15-060) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP15",
  cost: 6,
  power: 8000,
  traits: ["Sky Island"],
  attribute: "special",
  effect:
    "If you have 6 or less DON!! cards on your field, this Character cannot be removed from the field by your opponent's effects and gains +2000 power.\n[Activate: Main] DON!! -1: This Character gains [Blocker] until the end of your opponent's next End Phase. Then, trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "untilEndOfOpponentNextEndPhase",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "lte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "cannotBeRemoved",
            target: {
              player: "self",
              zones: ["field"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            bySource: "opponentEffect",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15Enel060I18n,
};
