import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const platedBullet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l75tlzsmw3",
  slug: "plated-bullet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l75tlzsmw3:face:default",
      catalogId: "l75tlzsmw3",
      name: "Plated Bullet",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "Renewable (If this card would be banished from the field or an intent, put it into its owner's material deck instead.)\n\nREST: Load Plated Bullet into target unloaded Gun weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker's intent.)",
      abilities: [
        {
          id: "l75tlzsmw3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Renewable (If this card would be banished from the field or an intent, put it into its owner's material deck instead.)",
          keyword: {
            name: "renewable",
          },
        },
        {
          id: "l75tlzsmw3-a2",
          kind: "activated",
          text: "REST: Load Plated Bullet into target unloaded Gun weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker's intent.)",
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

export default platedBullet;
