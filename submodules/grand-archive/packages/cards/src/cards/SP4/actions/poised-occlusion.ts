import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poisedOcclusion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w64layznmh",
  slug: "poised-occlusion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w64layznmh:face:default",
      catalogId: "w64layznmh",
      name: "Poised Occlusion",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL", "REACTION"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Negate target card activation. Put the card that had its activation negated this way into its owner's memory.\n\n[Class Bonus] Draw a card into your memory. Your champion becomes distant.",
      abilities: [
        {
          id: "w64layznmh-a1",
          kind: "card-resolution",
          text: "Negate target card activation. Put the card that had its activation negated this way into its owner's memory.",
          targets: [
            {
              id: "target-activation",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "negate",
                subject: {
                  kind: "bound",
                  binding: "target-activation",
                },
                bindResultAs: "negated-activation",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "negated-activation",
                },
                then: {
                  kind: "move",
                  subject: {
                    kind: "stack-source",
                    binding: "target-activation",
                  },
                  destination: {
                    zone: "memory",
                  },
                },
              },
            ],
          },
        },
        {
          id: "w64layznmh-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Draw a card into your memory. Your champion becomes distant.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default poisedOcclusion;
