import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aliceGoldenQueen: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "daip7s9ztd",
  slug: "alice-golden-queen",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "daip7s9ztd:face:default",
      catalogId: "daip7s9ztd",
      name: "Alice, Golden Queen",
      lineageName: "Alice",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "QUEEN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "Inherited Effect — Chessman Command attack cards you activate enter the intent with +1POWER.\n\nLineage Release — For each awake Chessman ally you control, prevent the next 3 damage that would be dealt to that ally this turn.",
      abilities: [
        {
          id: "daip7s9ztd-a1",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect — Chessman Command attack cards you activate enter the intent with +1POWER.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "card-activated",
                actor: "controller",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ATTACK"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["CHESSMAN"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["COMMAND"],
                      },
                    ],
                  },
                },
              },
              operation: {
                kind: "modify-characteristic",
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: 1,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
        },
        {
          id: "daip7s9ztd-a2",
          kind: "activated",
          text: "Lineage Release — For each awake Chessman ally you control, prevent the next 3 damage that would be dealt to that ally this turn.",
          keyword: {
            name: "lineage-release",
            cost: {
              kind: "banish-self",
            },
          },
          functionalZones: ["inner-lineage"],
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "for-each",
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
                    oneOf: ["CHESSMAN"],
                  },
                  {
                    kind: "object-state",
                    state: "awake",
                  },
                ],
              },
            },
            bindEachAs: "protected-awake-ally",
            effect: {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "bound-object",
                  binding: "protected-awake-ally",
                },
              },
              operation: {
                kind: "prevent",
              },
              capacity: {
                amount: 3,
                scope: "replacement-instance",
              },
              duration: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default aliceGoldenQueen;
