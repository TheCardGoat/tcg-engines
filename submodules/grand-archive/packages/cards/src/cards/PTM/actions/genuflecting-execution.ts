import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const genuflectingExecution: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iqzaNLhqk4",
  slug: "genuflecting-execution",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iqzaNLhqk4:face:default",
      catalogId: "iqzaNLhqk4",
      name: "Genuflecting Execution",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["EXALTED", "WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus]Efficiency (This card costs LV less to activate. LV refers to your champion’s level.)\n\nDestroy up to two target rested allies.",
      abilities: [
        {
          id: "iqzaNLhqk4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus]Efficiency (This card costs LV less to activate. LV refers to your champion’s level.)",
          keyword: {
            name: "efficiency",
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
          id: "iqzaNLhqk4-a2",
          kind: "card-resolution",
          text: "Destroy up to two target rested allies.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "object-state",
                      state: "rested",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default genuflectingExecution;
