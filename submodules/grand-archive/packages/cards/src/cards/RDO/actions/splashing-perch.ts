import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const splashingPerch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ba08K8VZnF",
  slug: "splashing-perch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ba08K8VZnF:face:default",
      catalogId: "ba08K8VZnF",
      name: "Splashing Perch",
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
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "If your champion is distant, draw a card. Otherwise, your champion becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "ba08K8VZnF-a1",
          kind: "card-resolution",
          text: "If your champion is distant, draw a card. Otherwise, your champion becomes distant. (Units stay distant until the end of their controller's turn.)",
          effect: {
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "champion",
                player: "controller",
              },
              state: "distant",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
            else: {
              kind: "set-object-state",
              subject: {
                kind: "champion",
                player: "controller",
              },
              state: "distant",
              value: true,
            },
          },
        },
      ],
    },
  },
};

export default splashingPerch;
