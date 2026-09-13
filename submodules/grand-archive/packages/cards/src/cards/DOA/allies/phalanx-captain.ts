import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const phalanxCaptain: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rPpLwLPGaL",
  slug: "phalanx-captain",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rPpLwLPGaL:face:default",
      catalogId: "rPpLwLPGaL",
      name: "Phalanx Captain",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to activate for each Human ally you control. (Apply this effect only if your champion's class matches this card's class.)\n\nOther Human allies you control get +1 POWER as long as they're attacking.",
      abilities: [
        {
          id: "rPpLwLPGaL-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate for each Human ally you control. (Apply this effect only if your champion's class matches this card's class.)",
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
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "rPpLwLPGaL-a2",
          kind: "static",
          staticKind: "effects",
          text: "Other Human allies you control get +1 POWER as long as they're attacking.",
          effects: [
            {
              kind: "continuous",
              subjects: {
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
                        kind: "object-state",
                        state: "attacking",
                      },
                      {
                        kind: "not-source",
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HUMAN"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default phalanxCaptain;
