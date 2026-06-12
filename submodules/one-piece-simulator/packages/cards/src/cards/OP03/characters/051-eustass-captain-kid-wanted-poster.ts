import type { CharacterCard } from "@tcg/op-types";
import { op03EustassCaptainKidWantedPoster051I18n } from "./051-eustass-captain-kid-wanted-poster.i18n.ts";

export const op03EustassCaptainKidWantedPoster051: CharacterCard = {
  id: "OP01-051",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP03",
  cost: 8,
  power: 8000,
  traits: ["Kid Pirates Supernovas"],
  attribute: "special",
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
  i18n: op03EustassCaptainKidWantedPoster051I18n,
};
