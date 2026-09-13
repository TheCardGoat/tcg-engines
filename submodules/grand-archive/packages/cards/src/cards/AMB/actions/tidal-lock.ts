import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tidalLock: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c4poa10ezw",
  slug: "tidal-lock",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c4poa10ezw:face:default",
      catalogId: "c4poa10ezw",
      name: "Tidal Lock",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "As long as you have three or more water element cards in your graveyard, this card costs 2 less to activate.\n\nNegate target card activation unless its controller pays (2). Banish the card that had its activation negated this way.",
      abilities: [
        {
          id: "c4poa10ezw-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you have three or more water element cards in your graveyard, this card costs 2 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["graveyard"],
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 3,
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "c4poa10ezw-a2",
          kind: "card-resolution",
          text: "Negate target card activation unless its controller pays (2). Banish the card that had its activation negated this way.",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "unless-paid",
                player: {
                  controllerOf: "target-stack-item",
                },
                cost: {
                  kind: "pay-reserve",
                  amount: 2,
                },
                otherwise: {
                  kind: "negate",
                  subject: {
                    kind: "bound",
                    binding: "target-stack-item",
                  },
                  bindResultAs: "negated-stack-item",
                },
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "stack-source",
                  binding: "negated-stack-item",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default tidalLock;
