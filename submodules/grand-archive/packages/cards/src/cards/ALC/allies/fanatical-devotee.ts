import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fanaticalDevotee: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1gxrpx8jyp",
  slug: "fanatical-devotee",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1gxrpx8jyp:face:default",
      catalogId: "1gxrpx8jyp",
      name: "Fanatical Devotee",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Memory 4+] Fanatical Devotee gets + 1 POWER. (Apply this effect only if there are four or more cards in your memory.)\n\n[Class Bonus] On Death: You may banish two other fire element cards from your graveyard. When you do, deal 3 damage to target champion.",
      abilities: [
        {
          id: "1gxrpx8jyp-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Memory 4+] Fanatical Devotee gets + 1 POWER. (Apply this effect only if there are four or more cards in your memory.)",
          restrictions: [
            {
              kind: "static",
              name: "memory-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
                  operator: "gte",
                  right: 4,
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
          ],
        },
        {
          id: "1gxrpx8jyp-a2",
          kind: "triggered",
          text: "[Class Bonus] On Death: You may banish two other fire element cards from your graveyard. When you do, deal 3 damage to target champion.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              action: {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 2,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                        {
                          kind: "not-source",
                        },
                      ],
                    },
                  },
                },
              },
              consequence: {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 3,
              },
              targets: [
                {
                  id: "target-1",
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
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default fanaticalDevotee;
