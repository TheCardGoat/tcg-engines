import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const devotionsPrice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ri955ygd5v",
  slug: "devotions-price",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ri955ygd5v:face:default",
      catalogId: "ri955ygd5v",
      name: "Devotion's Price",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, discard two cards.\n\nFor each omen you have with a different reserve cost, draw a card. Until end of turn, you can't draw cards.",
      abilities: [
        {
          id: "ri955ygd5v-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, discard two cards.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "hand",
                to: "graveyard",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ri955ygd5v-a2",
          kind: "card-resolution",
          text: "For each omen you have with a different reserve cost, draw a card. Until end of turn, you can't draw cards.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "repeat",
                count: {
                  kind: "count",
                  collection: {
                    zones: ["banishment"],
                    player: "controller",
                    filter: {
                      kind: "has-counter",
                      counter: "omen",
                    },
                  },
                  distinctBy: "reserve-cost",
                },
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "draw",
                subject: {
                  kind: "player",
                  player: "controller",
                },
                duration: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default devotionsPrice;
