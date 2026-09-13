import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const amorphousMissile: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "782mm2tq5l",
  slug: "amorphous-missile",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "782mm2tq5l:face:default",
      catalogId: "782mm2tq5l",
      name: "Amorphous Missile",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
      },
      rulesText:
        "Renewable (If this card would be banished from the field or an intent, put it into its owner's material deck instead.)\n\n(1), REST: Load Amorphous Missile into target unloaded Ranger weapon you control.",
      abilities: [
        {
          id: "782mm2tq5l-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Renewable (If this card would be banished from the field or an intent, put it into its owner's material deck instead.)",
          keyword: {
            name: "renewable",
          },
        },
        {
          id: "782mm2tq5l-a2",
          kind: "activated",
          text: "(1), REST: Load Amorphous Missile into target unloaded Ranger weapon you control.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
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
                      oneOf: ["RANGER"],
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

export default amorphousMissile;
