import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const safeguardParagon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "apu7wiw3cl",
  slug: "safeguard-paragon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "apu7wiw3cl:face:default",
      catalogId: "apu7wiw3cl",
      name: "Safeguard Paragon",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Sacrifice Safeguard Paragon: Prevent the next 4 non-combat damage that would be dealt to each unit you control this turn.",
      abilities: [
        {
          id: "apu7wiw3cl-a1",
          kind: "activated",
          text: "Sacrifice Safeguard Paragon: Prevent the next 4 non-combat damage that would be dealt to each unit you control this turn.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              combatDamage: false,
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 4,
              scope: "per-object",
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

export default safeguardParagon;
