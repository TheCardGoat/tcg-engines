import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const protectorRaccoon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JeyOuhr3sj",
  slug: "protector-raccoon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "JeyOuhr3sj:face:default",
      catalogId: "JeyOuhr3sj",
      name: "Protector Raccoon",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "RACCOON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Fast Activation (You may activate this card at fast speed.)\n\nREST: Prevent the next 2 damage that would be dealt to target Animal ally this turn.\n\nREST: Target opponent banishes a card from their graveyard.",
      abilities: [
        {
          id: "JeyOuhr3sj-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
        },
        {
          id: "JeyOuhr3sj-a2",
          kind: "activated",
          text: "REST: Prevent the next 2 damage that would be dealt to target Animal ally this turn.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
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
                      kind: "subtype",
                      oneOf: ["ANIMAL"],
                    },
                  ],
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
              amount: 2,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "JeyOuhr3sj-a3",
          kind: "activated",
          text: "REST: Target opponent banishes a card from their graveyard.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "banish",
            player: {
              binding: "target-opponent",
            },
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: {
                binding: "target-opponent",
              },
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: {
                  binding: "target-opponent",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default protectorRaccoon;
