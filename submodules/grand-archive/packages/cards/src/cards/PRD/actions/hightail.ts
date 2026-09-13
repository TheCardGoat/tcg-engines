import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hightail: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Xy8loj55gJ",
  slug: "hightail",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Xy8loj55gJ:face:default",
      catalogId: "Xy8loj55gJ",
      name: "Hightail",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target unit becomes distant. If that unit is a Ranger, draw a card into your memory. (Units stay distant until the end of their controller’s turn.)",
      abilities: [
        {
          id: "Xy8loj55gJ-a1",
          kind: "card-resolution",
          text: "Target unit becomes distant. If that unit is a Ranger, draw a card into your memory. (Units stay distant until the end of their controller’s turn.)",
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
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                state: "distant",
                value: true,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  filter: {
                    kind: "subtype",
                    oneOf: ["RANGER"],
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default hightail;
