import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const backstep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sesw2ugmnm",
  slug: "backstep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sesw2ugmnm:face:default",
      catalogId: "sesw2ugmnm",
      name: "Backstep",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target unit becomes distant. (Units stay distant until the end of their controller's turn.)\n\nDraw a card. ",
      abilities: [
        {
          id: "sesw2ugmnm-a1",
          kind: "card-resolution",
          text: "Target unit becomes distant. (Units stay distant until the end of their controller's turn.)",
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
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "distant",
            value: true,
          },
        },
        {
          id: "sesw2ugmnm-a2",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default backstep;
