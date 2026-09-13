import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const relentlessOutburst: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oobp8g4cpe",
  slug: "relentless-outburst",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oobp8g4cpe:face:default",
      catalogId: "oobp8g4cpe",
      name: "Relentless Outburst",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["EXIA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] [Damage 35+] Until end of turn, if target champion would take damage this turn, they take that much damage plus 1 instead. \n\nFor every six damage counters on your champion, deal 1 damage to all other units.",
      abilities: [
        {
          id: "oobp8g4cpe-a1",
          kind: "card-resolution",
          text: "[Class Bonus] [Damage 35+] Until end of turn, if target champion would take damage this turn, they take that much damage plus 1 instead.",
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
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 35,
                },
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "modify-amount",
              operation: "add",
              amount: 1,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "oobp8g4cpe-a2",
          kind: "card-resolution",
          text: "For every six damage counters on your champion, deal 1 damage to all other units.",
          effect: {
            kind: "repeat",
            count: {
              kind: "calculate",
              operator: "divide",
              operands: [
                {
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "damage",
                },
                6,
              ],
              rounding: "down",
            },
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
              },
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default relentlessOutburst;
