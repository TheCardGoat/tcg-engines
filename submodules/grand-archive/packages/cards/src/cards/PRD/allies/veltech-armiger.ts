import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const veltechArmiger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5v9mCHv2qG",
  slug: "veltech-armiger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5v9mCHv2qG:face:default",
      catalogId: "5v9mCHv2qG",
      name: "VelTech Armiger",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Ranged 3 (As long as this unit is distant, its attacks get +3POWER.)\n\n[Class Bonus] Whenever VelTech Armiger becomes linked to a VelTech item, VelTech Armiger becomes distant. (Units stay distant until the end of their controller’s turn.)",
      abilities: [
        {
          id: "5v9mCHv2qG-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 3 (As long as this unit is distant, its attacks get +3POWER.)",
          keyword: {
            name: "ranged",
            value: 3,
          },
        },
        {
          id: "5v9mCHv2qG-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever VelTech Armiger becomes linked to a VelTech item, VelTech Armiger becomes distant. (Units stay distant until the end of their controller’s turn.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-linked",
              subject: {
                kind: "source",
              },
              host: {
                kind: "event-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["VELTECH"],
                    },
                  ],
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
            kind: "set-object-state",
            subject: {
              kind: "source",
            },
            state: "distant",
            value: true,
          },
        },
      ],
    },
  },
};

export default veltechArmiger;
