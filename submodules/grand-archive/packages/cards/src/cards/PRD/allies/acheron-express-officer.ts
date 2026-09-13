import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const acheronExpressOfficer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9fRWmhqsNS",
  slug: "acheron-express-officer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9fRWmhqsNS:face:default",
      catalogId: "9fRWmhqsNS",
      name: "Acheron Express Officer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "DISCORP", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Ranged 3 (As long as this unit is distant, its attacks get +3POWER.)\n\n[Class Bonus] On Enter: If you control another DisCorp ally, Acheron Express Officer becomes distant. (Units stay distant until the end of their controller’s turn.)",
      abilities: [
        {
          id: "9fRWmhqsNS-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 3 (As long as this unit is distant, its attacks get +3POWER.)",
          keyword: {
            name: "ranged",
            value: 3,
          },
        },
        {
          id: "9fRWmhqsNS-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If you control another DisCorp ally, Acheron Express Officer becomes distant. (Units stay distant until the end of their controller’s turn.)",
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
                      oneOf: ["DISCORP"],
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
        },
      ],
    },
  },
};

export default acheronExpressOfficer;
