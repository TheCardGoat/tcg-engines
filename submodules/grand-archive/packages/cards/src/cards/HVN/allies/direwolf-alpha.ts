import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const direwolfAlpha: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5n874ubgai",
  slug: "direwolf-alpha",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5n874ubgai:face:default",
      catalogId: "5n874ubgai",
      name: "Direwolf Alpha",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "WOLF"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Pride 2\n\n[Class Bonus] On Enter: You may banish a fire element card from your graveyard. If you do, summon a Direwolf token.\n\n[Class Bonus] [Level 2+] Other Wolf objects you control get +1 POWER.",
      abilities: [
        {
          id: "5n874ubgai-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 2",
          keyword: {
            name: "pride",
            value: 2,
          },
        },
        {
          id: "5n874ubgai-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may banish a fire element card from your graveyard. If you do, summon a Direwolf token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "summon",
                    object: "Direwolf",
                    controller: "controller",
                    bindResultAs: "summoned-token",
                  },
                },
              ],
            },
          },
        },
        {
          id: "5n874ubgai-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Other Wolf objects you control get +1 POWER.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
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
                        kind: "subtype",
                        oneOf: ["WOLF"],
                      },
                      {
                        kind: "not-source",
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

export default direwolfAlpha;
