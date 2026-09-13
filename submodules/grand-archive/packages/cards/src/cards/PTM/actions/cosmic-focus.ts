import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cosmicFocus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dWgPzoEbIE",
  slug: "cosmic-focus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dWgPzoEbIE:face:default",
      catalogId: "dWgPzoEbIE",
      name: "Cosmic Focus",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Starcalling — (0)\n\nIf your champion is distant, they gain ranged 4 for as long as they remain distant. Otherwise, they become distant.\n\nYou may put Cosmic Focus into its owner's deck fourth from the top.",
      abilities: [
        {
          id: "dWgPzoEbIE-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Starcalling — (0)",
          keyword: {
            name: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 0,
            },
          },
        },
        {
          id: "dWgPzoEbIE-a2",
          kind: "card-resolution",
          text: "If your champion is distant, they gain ranged 4 for as long as they remain distant. Otherwise, they become distant.",
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
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "locked",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
              },
              duration: {
                kind: "while-condition",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "ranged",
                  value: 4,
                },
              },
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
        {
          id: "dWgPzoEbIE-a3",
          kind: "card-resolution",
          text: "You may put Cosmic Focus into its owner's deck fourth from the top.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "move",
              subject: {
                kind: "source",
              },
              destination: {
                zone: "main-deck",
                placement: {
                  kind: "position-from-top",
                  position: 4,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default cosmicFocus;
