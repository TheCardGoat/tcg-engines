import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lilyMarineCastellan: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l83tuzrl2a",
  slug: "lily-marine-castellan",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l83tuzrl2a:face:default",
      catalogId: "l83tuzrl2a",
      name: "Lily, Marine Castellan",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CHESSMAN", "ROOK", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "Commanded Will 2 (As long as this unit is attacking using a Command card, it gets +2POWER.)\n\nOn Attack: If Lily is attacking a unit with an even life stat, this attack gets +1POWER and you may return a card from your memory to your hand.",
      abilities: [
        {
          id: "l83tuzrl2a-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Commanded Will 2 (As long as this unit is attacking using a Command card, it gets +2POWER.)",
          keyword: {
            name: "commanded-will",
            value: 2,
          },
        },
        {
          id: "l83tuzrl2a-a2",
          kind: "triggered",
          text: "On Attack: If Lily is attacking a unit with an even life stat, this attack gets +1POWER and you may return a card from your memory to your hand.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
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
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
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
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "returned-card",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["memory"],
                        relationship: "zone-of",
                        player: "controller",
                      },
                    },
                    effect: {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "returned-card",
                      },
                      from: "memory",
                      destination: {
                        zone: "hand",
                      },
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

export default lilyMarineCastellan;
