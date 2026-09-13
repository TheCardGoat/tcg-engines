import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const maChaoLupineHuntress: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fw8yvhf3mz",
  slug: "ma-chao-lupine-huntress",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fw8yvhf3mz:face:default",
      catalogId: "fw8yvhf3mz",
      name: "Ma Chao, Lupine Huntress",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] [Level 2+] Ma Chao gets +1 POWER and has vigor.\n\nOn Enter: Target opponent banishes two cards from their graveyard. If you control an Animal or Beast ally, that player banishes four cards from their graveyard instead.",
      abilities: [
        {
          id: "fw8yvhf3mz-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Ma Chao gets +1 POWER and has vigor.",
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
                kind: "source",
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
                  name: "vigor",
                },
              },
            },
          ],
        },
        {
          id: "fw8yvhf3mz-a2",
          kind: "triggered",
          text: "On Enter: Target opponent banishes two cards from their graveyard. If you control an Animal or Beast ally, that player banishes four cards from their graveyard instead.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "conditional",
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
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "banish",
              player: "event-actor",
              selection: {
                id: "banished-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "event-actor",
                count: {
                  kind: "exactly",
                  amount: 4,
                },
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: "event-actor",
                },
              },
            },
            else: {
              kind: "banish",
              player: {
                binding: "target-opponent",
              },
              selection: {
                id: "banished-cards",
                kind: "choice",
                declared: "resolution",
                chooser: {
                  binding: "target-opponent",
                },
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                candidates: {
                  kind: "card",
                  zones: ["graveyard"],
                  relationship: "zone-of",
                  player: {
                    binding: "target-opponent",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default maChaoLupineHuntress;
