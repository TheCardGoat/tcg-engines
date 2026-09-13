import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const corrosiveJuggler: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Ow9tNHwpUB",
  slug: "corrosive-juggler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Ow9tNHwpUB:face:default",
      catalogId: "Ow9tNHwpUB",
      name: "Corrosive Juggler",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\nOn Enter: You may rest Corrosive Juggler. When you do, deal 1 damage to target unit. That unit's attacks get -2POWER until end of turn.",
      abilities: [
        {
          id: "Ow9tNHwpUB-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
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
        },
        {
          id: "Ow9tNHwpUB-a2",
          kind: "triggered",
          text: "On Enter: You may rest Corrosive Juggler. When you do, deal 1 damage to target unit. That unit's attacks get -2POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              action: {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              consequence: {
                kind: "sequence",
                effects: [
                  {
                    kind: "deal-damage",
                    source: {
                      kind: "source",
                    },
                    recipient: {
                      kind: "bound",
                      binding: "target-1",
                    },
                    amount: 1,
                  },
                  {
                    kind: "continuous",
                    subjects: {
                      kind: "attacks-by",
                      attacker: {
                        kind: "bound",
                        binding: "target-1",
                      },
                    },
                    affectedSet: "dynamic",
                    duration: {
                      kind: "this-turn",
                    },
                    layer: {
                      layer: "E",
                      modifies: "stat",
                      sublayer: "modifier",
                    },
                    change: {
                      kind: "numeric",
                      property: "power",
                      operation: "subtract",
                      amount: 2,
                    },
                  },
                ],
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
                      oneOf: ["ALLY", "CHAMPION"],
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

export default corrosiveJuggler;
