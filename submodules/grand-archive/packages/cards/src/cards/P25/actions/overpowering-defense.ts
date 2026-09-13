import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const overpoweringDefense: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "14hr8i5oix",
  slug: "overpowering-defense",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "14hr8i5oix:face:default",
      catalogId: "14hr8i5oix",
      name: "Overpowering Defense",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only if a Guardian unit you control is attacking.\n\nNegate all card activations you don't control.",
      abilities: [
        {
          id: "14hr8i5oix-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only if a Guardian unit you control is attacking.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "object-state",
                        state: "attacking",
                      },
                      {
                        kind: "subtype",
                        oneOf: ["GUARDIAN"],
                      },
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "14hr8i5oix-a2",
          kind: "card-resolution",
          text: "Negate all card activations you don't control.",
          effect: {
            kind: "negate",
            subject: {
              kind: "each",
              collection: {
                zones: ["effects-stack"],
                player: "opponent",
              },
            },
          },
        },
      ],
    },
  },
};

export default overpoweringDefense;
