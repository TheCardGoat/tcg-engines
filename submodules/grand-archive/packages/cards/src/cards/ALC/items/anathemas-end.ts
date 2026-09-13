import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const anathemasEnd: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ii17fzcyfr",
  slug: "anathemas-end",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ii17fzcyfr:face:default",
      catalogId: "ii17fzcyfr",
      name: "Anathema's End",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 1,
      },
      rulesText:
        "REST: Load Anathema's End into target unloaded Gun weapon you control.\n\n[Class Bonus] On Champion Hit: Banish all Curse cards in the hit champion's lineage. For each card banished this way, deal 2 unpreventable damage to that champion.",
      abilities: [
        {
          id: "ii17fzcyfr-a1",
          kind: "activated",
          text: "REST: Load Anathema's End into target unloaded Gun weapon you control.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-weapon",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["GUN"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "object-state",
                        state: "loaded",
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "loaded",
              host: {
                kind: "bound",
                binding: "target-weapon",
              },
            },
          },
        },
        {
          id: "ii17fzcyfr-a2",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: Banish all Curse cards in the hit champion's lineage. For each card banished this way, deal 2 unpreventable damage to that champion.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
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
            kind: "choose",
            selection: {
              id: "banished-curses",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "all",
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["inner-lineage"],
                host: {
                  kind: "event-recipient",
                },
                relationship: "lineage-of",
                filter: {
                  kind: "subtype",
                  oneOf: ["CURSE"],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "banished-curses",
                  },
                  from: "inner-lineage",
                  destination: {
                    zone: "banishment",
                  },
                  bindResultAs: "banished-curse-count",
                },
                {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "event-recipient",
                  },
                  amount: {
                    kind: "calculate",
                    operator: "multiply",
                    operands: [
                      {
                        kind: "binding-count",
                        binding: "banished-curse-count",
                      },
                      2,
                    ],
                  },
                  preventable: false,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default anathemasEnd;
