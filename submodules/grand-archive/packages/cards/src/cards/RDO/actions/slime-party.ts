import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slimeParty: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AJeuUDTPmV",
  slug: "slime-party",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AJeuUDTPmV:face:default",
      catalogId: "AJeuUDTPmV",
      name: "Slime Party",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SLIME", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Silvie Bonus] This card costs 1 less to activate for each different element Slime ally you control. (Apply this effect only if your champion is Silvie.)\n\nPut a buff counter on each Slime ally you control.",
      abilities: [
        {
          id: "AJeuUDTPmV-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Silvie Bonus] This card costs 1 less to activate for each different element Slime ally you control. (Apply this effect only if your champion is Silvie.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Silvie",
              },
            },
          ],
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
                        oneOf: ["SLIME"],
                      },
                    ],
                  },
                },
                distinctBy: "element",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "AJeuUDTPmV-a2",
          kind: "card-resolution",
          text: "Put a buff counter on each Slime ally you control.",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "each",
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
                      oneOf: ["SLIME"],
                    },
                  ],
                },
              },
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default slimeParty;
