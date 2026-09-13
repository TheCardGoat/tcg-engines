import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rollingChorus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "IZVXDYjcSL",
  slug: "rolling-chorus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "IZVXDYjcSL:face:default",
      catalogId: "IZVXDYjcSL",
      name: "Rolling Chorus",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL", "MELODY"],
      },
      elements: ["ARCANE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Banish up to two target cards from a single graveyard. If the total reserve cost of the banished cards is 15 or greater, draw a card into your memory.",
      abilities: [
        {
          id: "IZVXDYjcSL-a1",
          kind: "card-resolution",
          text: "Banish up to two target cards from a single graveyard. If the total reserve cost of the banished cards is 15 or greater, draw a card into your memory.",
          targets: [
            {
              id: "target-graveyard-cards",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              singleZoneOwner: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish-object",
                subject: {
                  kind: "bound",
                  binding: "target-graveyard-cards",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "aggregate-property",
                      operation: "sum",
                      collection: {
                        binding: "target-graveyard-cards",
                      },
                      property: "reserve-cost",
                      basis: "base",
                      emptyValue: 0,
                    },
                    operator: "gte",
                    right: 15,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default rollingChorus;
