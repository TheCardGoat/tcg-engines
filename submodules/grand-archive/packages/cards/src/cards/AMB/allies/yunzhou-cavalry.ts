import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const yunzhouCavalry: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ann23jkuys",
  slug: "yunzhou-cavalry",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ann23jkuys:face:default",
      catalogId: "ann23jkuys",
      name: "Yunzhou Cavalry",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER. Apply this effect only if your champion's class matches this card's class.)\n\nEquestrian — On Enter: If you control a Horse ally, Yunzhou Cavalry becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "ann23jkuys-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 2 (As long as this unit is distant, its attacks get +2 POWER. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "ranged",
            value: 2,
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
          id: "ann23jkuys-a2",
          kind: "triggered",
          text: "Equestrian — On Enter: If you control a Horse ally, Yunzhou Cavalry becomes distant. (Units stay distant until the end of their controller's turn.)",
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
                      kind: "subtype",
                      oneOf: ["HORSE"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "set-object-state",
              subject: {
                kind: "source",
              },
              state: "distant",
              value: true,
            },
          },
          label: {
            name: "Equestrian",
          },
        },
      ],
    },
  },
};

export default yunzhouCavalry;
