import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const starstrungReading: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gwWociEfxb",
  slug: "starstrung-reading",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gwWociEfxb:face:default",
      catalogId: "gwWociEfxb",
      name: "Starstrung Reading",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Aethercharge cards you look at while glimpsing the next three times this turn have aethercalling.\n\nIf your champion is distant, glimpse 4.",
      abilities: [
        {
          id: "gwWociEfxb-a1",
          kind: "card-resolution",
          text: "Aethercharge cards you look at while glimpsing the next three times this turn have aethercalling.",
          effect: {
            kind: "rule-modification",
            mode: "grant-keyword",
            action: "glimpse",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "subtype",
              oneOf: ["AETHERCHARGE"],
            },
            grantedKeyword: {
              name: "aethercalling",
            },
            occurrence: {
              count: 3,
              window: "this-turn",
              actorScope: "same-player",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "gwWociEfxb-a2",
          kind: "card-resolution",
          text: "If your champion is distant, glimpse 4.",
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
              kind: "keyword-action",
              action: "glimpse",
              amount: 4,
            },
          },
        },
      ],
    },
  },
};

export default starstrungReading;
