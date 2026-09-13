import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stridetechW: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rdI48Qb5mP",
  slug: "stridetech-w",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rdI48Qb5mP:face:default",
      catalogId: "rdI48Qb5mP",
      name: "StrideTech W",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "VELTECH", "BOOTS"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Ally Link\n\nOn Enter: If you control the linked ally, draw a card into your memory.\n\n(1), Sacrifice StrideTech W: Return the linked ally to its owner's memory.",
      abilities: [
        {
          id: "rdI48Qb5mP-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "rdI48Qb5mP-a2",
          kind: "triggered",
          text: "On Enter: If you control the linked ally, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "controls-subject",
              player: "controller",
              subject: {
                kind: "linked-object",
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
        {
          id: "rdI48Qb5mP-a3",
          kind: "activated",
          text: "(1), Sacrifice StrideTech W: Return the linked ally to its owner's memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "move",
            subject: {
              kind: "linked-object",
            },
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default stridetechW;
