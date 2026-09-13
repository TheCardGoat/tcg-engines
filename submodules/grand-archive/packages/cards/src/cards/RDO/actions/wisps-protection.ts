import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wispsProtection: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OmWFVRUr8I",
  slug: "wisps-protection",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OmWFVRUr8I:face:default",
      catalogId: "OmWFVRUr8I",
      name: "Wisp's Protection",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 4+X damage that would be dealt to target unit this turn, where X is the amount of regalia on the field.",
      abilities: [
        {
          id: "OmWFVRUr8I-a1",
          kind: "card-resolution",
          text: "Prevent the next 4+X damage that would be dealt to target unit this turn, where X is the amount of regalia on the field.",
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "each-player",
                  filter: {
                    kind: "supertype",
                    oneOf: ["REGALIA"],
                  },
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
              kind: "prevent",
            },
            capacity: {
              amount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  4,
                  {
                    kind: "variable",
                    symbol: "X",
                  },
                ],
              },
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default wispsProtection;
