import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gloamspireProwler: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "igpck2z4rs",
  slug: "gloamspire-prowler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "igpck2z4rs:face:default",
      catalogId: "igpck2z4rs",
      name: "Gloamspire Prowler",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN", "RANGER"],
        subtypes: ["ASSASSIN", "RANGER", "HUMAN", "CURSE"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "This card costs 3 less to activate as long as there are two or more Curse cards in your champion's lineage.\n\n[Class Bonus] On Death: Put Gloamspire Prowler on the bottom of your champion's lineage. Draw a card and recover 2.\n\nInherited Effect: This object gets -2 LIFE.",
      abilities: [
        {
          id: "igpck2z4rs-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 3 less to activate as long as there are two or more Curse cards in your champion's lineage.",
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
                      zones: ["inner-lineage"],
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["CURSE"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "igpck2z4rs-a2",
          kind: "triggered",
          text: "[Class Bonus] On Death: Put Gloamspire Prowler on the bottom of your champion's lineage. Draw a card and recover 2.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
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
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "inner-lineage",
                  host: {
                    kind: "champion",
                    player: "controller",
                  },
                  placement: {
                    kind: "bottom",
                  },
                },
              },
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                  {
                    kind: "recover",
                    player: "controller",
                    amount: 2,
                  },
                ],
              },
            ],
          },
        },
        {
          id: "igpck2z4rs-a3",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect: This object gets -2 LIFE.",
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "ability-bearer",
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
                property: "life",
                operation: "subtract",
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default gloamspireProwler;
