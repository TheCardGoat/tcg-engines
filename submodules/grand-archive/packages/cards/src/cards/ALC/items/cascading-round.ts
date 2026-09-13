import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cascadingRound: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ywc08c9htu",
  slug: "cascading-round",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ywc08c9htu:face:default",
      catalogId: "ywc08c9htu",
      name: "Cascading Round",
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
      elements: ["WATER"],
      stats: {
        power: 2,
      },
      rulesText:
        "Renewable (If this card would be banished from the field or an intent, put it into its owner's material deck instead.)\n\nREST: Load Cascading Round into target unloaded Gun weapon you control.\n\nOn Hit: Put the top card of your deck into your graveyard.",
      abilities: [
        {
          id: "ywc08c9htu-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Renewable (If this card would be banished from the field or an intent, put it into its owner's material deck instead.)",
          keyword: {
            name: "renewable",
          },
        },
        {
          id: "ywc08c9htu-a2",
          kind: "activated",
          text: "REST: Load Cascading Round into target unloaded Gun weapon you control.",
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
        {
          id: "ywc08c9htu-a3",
          kind: "triggered",
          text: "On Hit: Put the top card of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "mill",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default cascadingRound;
