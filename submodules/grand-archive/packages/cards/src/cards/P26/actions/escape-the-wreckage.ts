import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const escapeTheWreckage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "q2svd53zc9",
  slug: "escape-the-wreckage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "q2svd53zc9:face:default",
      catalogId: "q2svd53zc9",
      name: "Escape the Wreckage",
      cost: {
        kind: "reserve",
        amount: 3,
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
        "Return target ally you control to its owner's memory. If you do, draw a card into your memory.",
      abilities: [
        {
          id: "q2svd53zc9-a1",
          kind: "card-resolution",
          text: "Return target ally you control to its owner's memory. If you do, draw a card into your memory.",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  destination: {
                    zone: "memory",
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
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

export default escapeTheWreckage;
