import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const steelSlug: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ao8bki6fxx",
  slug: "steel-slug",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ao8bki6fxx:face:default",
      catalogId: "ao8bki6fxx",
      name: "Steel Slug",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "Renewable (If this card would be banished from the field or an intent, put it into its owner’s material deck instead.)\n\nREST: Load Steel Slug into target unloaded Gun weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker’s intent.)",
      abilities: [
        {
          id: "ao8bki6fxx-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Renewable (If this card would be banished from the field or an intent, put it into its owner’s material deck instead.)",
          keyword: {
            name: "renewable",
          },
        },
        {
          id: "ao8bki6fxx-a2",
          kind: "activated",
          text: "REST: Load Steel Slug into target unloaded Gun weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker’s intent.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-weapon",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "object-state",
                        state: "loaded",
                      },
                    },
                    {
                      kind: "subtype",
                      oneOf: ["GUN"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "loaded",
              host: {
                kind: "bound",
                binding: "target-weapon",
              },
            },
          },
        },
      ],
    },
  },
};

export default steelSlug;
