import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spontaneousCombustion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cQlxapCsxQ",
  slug: "spontaneous-combustion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cQlxapCsxQ:face:default",
      catalogId: "cQlxapCsxQ",
      name: "Spontaneous Combustion",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL", "REACTION"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText: "Deal 4 damage to target ally attacking your champion.",
      abilities: [
        {
          id: "cQlxapCsxQ-a1",
          kind: "card-resolution",
          text: "Deal 4 damage to target ally attacking your champion.",
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
                      state: "attacking",
                    },
                    {
                      kind: "attacking-subject",
                      defender: {
                        kind: "champion",
                        player: "controller",
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 4,
          },
        },
      ],
    },
  },
};

export default spontaneousCombustion;
