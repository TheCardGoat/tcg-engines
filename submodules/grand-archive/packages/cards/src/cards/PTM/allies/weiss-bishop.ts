import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const weissBishop: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Dgtim99eB5",
  slug: "weiss-bishop",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Dgtim99eB5:face:default",
      catalogId: "Dgtim99eB5",
      name: "Weiss Bishop",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "BISHOP", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "As long as you control one or more Pawn allies, Weiss Bishop has stealth.\n\n[Alice Bonus] Weiss Bishop gets +1 POWER as long as it's attacking a unit with an odd life stat.",
      abilities: [
        {
          id: "Dgtim99eB5-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control one or more Pawn allies, Weiss Bishop has stealth.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
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
                        oneOf: ["PAWN"],
                      },
                    ],
                  },
                },
              },
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
                  name: "stealth",
                },
              },
            },
          ],
        },
        {
          id: "Dgtim99eB5-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Alice Bonus] Weiss Bishop gets +1 POWER as long as it's attacking a unit with an odd life stat.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "source",
                },
                otherFilter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
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
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
        },
      ],
    },
  },
};

export default weissBishop;
