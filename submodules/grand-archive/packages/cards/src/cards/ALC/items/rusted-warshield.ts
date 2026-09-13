import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rustedWarshield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fp66pv4n1n",
  slug: "rusted-warshield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fp66pv4n1n:face:default",
      catalogId: "fp66pv4n1n",
      name: "Rusted Warshield",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Rusted Warshield: Prevent the next 2 damage that would be dealt to your champion this turn. Draw a card into your memory.",
      abilities: [
        {
          id: "fp66pv4n1n-a1",
          kind: "activated",
          text: "Banish Rusted Warshield: Prevent the next 2 damage that would be dealt to your champion this turn. Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "replacement",
                event: {
                  name: "damage-dealt",
                  recipient: {
                    kind: "event-object",
                    controller: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
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
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default rustedWarshield;
