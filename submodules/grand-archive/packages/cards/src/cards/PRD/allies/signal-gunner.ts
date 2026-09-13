import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const signalGunner: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fsudPn5GQH",
  slug: "signal-gunner",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fsudPn5GQH:face:default",
      catalogId: "fsudPn5GQH",
      name: "Signal Gunner",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.)\n\n[Class Bonus] Signal Gunner has ranged 2 for each VelTech item linked to it. (Multiple instances of ranged stack.)",
      abilities: [
        {
          id: "fsudPn5GQH-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "fsudPn5GQH-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Signal Gunner has ranged 2 for each VelTech item linked to it. (Multiple instances of ranged stack.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "ranged",
                  value: {
                    kind: "calculate",
                    operator: "multiply",
                    operands: [
                      2,
                      {
                        kind: "count",
                        collection: {
                          zones: ["field"],
                          host: {
                            kind: "source",
                          },
                          relationship: "linked-to",
                          filter: {
                            kind: "all",
                            filters: [
                              {
                                kind: "type",
                                oneOf: ["ITEM"],
                              },
                              {
                                kind: "subtype",
                                oneOf: ["VELTECH"],
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default signalGunner;
