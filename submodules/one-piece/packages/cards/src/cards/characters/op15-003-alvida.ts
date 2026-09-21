import type { CharacterCard } from "@tcg/op-types";
import { op15Alvida003I18n } from "./op15-003-alvida.i18n.ts";

export const op15Alvida003: CharacterCard = {
  id: "OP15-003",
  canonicalId: "OP15-003",
  slug: "alvida/op15-003",
  name: "Alvida",
  printings: [
    {
      id: "OP15-003",
      artId: "OP15-003",
      setCode: "OP15",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-003_tgjIXHg.jpg",
    },
    {
      id: "OP15-003_p1",
      artId: "OP15-003_p1",
      setCode: "OP15",
      collectorNumber: "003",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-003_p1_h0AKASO.jpg",
      label: "Alvida (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP15",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["East Blue Alvida Pirates"],
  attribute: "strike",
  effect:
    "If this Character would be K.O.'d, you may trash 1 Character card with a power of 6000 or less from your hand instead.\n[Activate: Main] [Once Per Turn] You may give 1 of your opponent's rested DON!! cards to 1 of your opponent's Characters: Give up to 1 rested DON!! card to its owner's Leader or 1 of their Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        oncePerTurn: true,
        optional: true,
        costs: [
          {
            cost: "giveDon",
            amount: 1,
            donorPlayer: "opponent",
            donState: "rested",
            recipientPlayer: "opponent",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donorPlayer: "opponent",
            donState: "rested",
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
          filters: [
            {
              filter: "cardCategory",
              value: "character",
            },
            {
              filter: "power",
              comparison: "lte",
              value: 6000,
            },
          ],
        },
      },
    ],
  },
  i18n: op15Alvida003I18n,
};
