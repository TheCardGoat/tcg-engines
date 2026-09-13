import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hypothermia: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cyfrzrplyw",
  slug: "hypothermia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cyfrzrplyw:face:default",
      catalogId: "cyfrzrplyw",
      name: "Hypothermia",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText: "Target rested ally gets -4 LIFE until end of turn.",
      abilities: [
        {
          id: "cyfrzrplyw-a1",
          kind: "card-resolution",
          text: "Target rested ally gets -4 LIFE until end of turn.",
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
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
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
              property: "life",
              operation: "subtract",
              amount: 4,
            },
          },
        },
      ],
    },
  },
};

export default hypothermia;
