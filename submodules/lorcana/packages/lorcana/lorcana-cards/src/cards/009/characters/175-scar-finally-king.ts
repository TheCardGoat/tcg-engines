import type { CharacterCard } from "@tcg/lorcana-types";
import { scarFinallyKingI18n } from "./175-scar-finally-king.i18n";

export const scarFinallyKing: CharacterCard = {
  id: "mUj",
  canonicalId: "ci_rq5",
  reprints: ["set9-175"],
  cardType: "character",
  name: "Scar",
  version: "Finally King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "009",
  cardNumber: 175,
  rarity: "legendary",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_3d02b1019aa34f70b5e0da64191d9326",
    tcgPlayer: 651108,
  },
  text: [
    {
      title: "BE GRATEFUL",
      description: "Your Ally characters get +1 {S}.",
    },
    {
      title: "STICK WITH ME",
      description:
        "At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "King"],
  abilities: [
    {
      id: "1vp-1",
      effect: {
        type: "modify-stat",
        modifier: 1,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Ally",
            },
          ],
        },
      },
      type: "static",
      name: "BE GRATEFUL",
      text: "BE GRATEFUL Your Ally characters get +1 {S}.",
    },
    {
      id: "1vp-2",
      name: "STICK WITH ME",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          reference: "source",
          filters: [{ type: "exerted" }],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "select-target",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [{ type: "has-classification", classification: "Ally" }],
              },
            },
            {
              type: "draw",
              amount: {
                type: "strength-of",
                target: {
                  ref: "previous-target",
                },
              },
              target: "CONTROLLER",
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "discard",
                    amount: 2,
                    target: "CONTROLLER",
                    chosen: true,
                  },
                  {
                    type: "banish",
                    target: {
                      reference: "selected-first",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      text: "STICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.",
    },
  ],
  i18n: scarFinallyKingI18n,
};
