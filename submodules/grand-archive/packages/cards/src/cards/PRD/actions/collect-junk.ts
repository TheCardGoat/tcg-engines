import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const collectJunk: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "g6sW55DOgR",
  slug: "collect-junk",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "g6sW55DOgR:face:default",
      catalogId: "g6sW55DOgR",
      name: "Collect Junk",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "RACCOON", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "This card costs 2 less to activate for each Raccoon ally you control.\n\nBanish up to one target card from a graveyard. Draw a card into your memory.",
      abilities: [
        {
          id: "g6sW55DOgR-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 less to activate for each Raccoon ally you control.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["RACCOON"],
                          },
                        ],
                      },
                    },
                  },
                  2,
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "g6sW55DOgR-a2",
          kind: "card-resolution",
          text: "Banish up to one target card from a graveyard. Draw a card into your memory.",
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
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
                  binding: "target-card",
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default collectJunk;
