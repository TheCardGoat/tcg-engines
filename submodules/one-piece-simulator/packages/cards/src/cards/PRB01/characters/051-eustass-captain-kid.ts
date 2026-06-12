import type { CharacterCard } from "@tcg/op-types";
import { prb01EustassCaptainKid051I18n } from "./051-eustass-captain-kid.i18n.ts";

export const prb01EustassCaptainKid051: CharacterCard = {
  id: "OP01-051",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "PRB01",
  cost: 8,
  power: 8000,
  traits: ["Supernovas", "Kid Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-051_p4.jpg",
      imageId: "OP01-051_p4",
    },
  ],
  effect:
    '[DON!! x1] [Opponent\'s Turn] If this Character is rested, your opponent cannot attack any card other than the Character [Eustass"Captain"Kid]. [Activate:Main] [Once Per Turn] You may rest this Character: Play up to 1 Character card with a cost of 3 or less from your hand.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "cardState",
            target: "this",
            property: "state",
            comparison: "eq",
            value: "rested",
          },
        ],
        actions: [
          {
            action: "attackRestriction",
            restriction: "cannotAttackOtherThan",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: 'Eustass"Captain"Kid',
                },
              ],
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: prb01EustassCaptainKid051I18n,
};
