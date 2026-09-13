import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chronowarp: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n2wtz6ql0a",
  slug: "chronowarp",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n2wtz6ql0a:face:default",
      catalogId: "n2wtz6ql0a",
      name: "Chronowarp",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "For the rest of the game, time is distorted. (As long as time is distorted, each player skips their first materialize phase and they get an additional materialize phase after their main phase each turn.)",
      abilities: [
        {
          id: "n2wtz6ql0a-a1",
          kind: "card-resolution",
          text: "For the rest of the game, time is distorted. (As long as time is distorted, each player skips their first materialize phase and they get an additional materialize phase after their main phase each turn.)",
          effect: {
            kind: "set-game-state",
            state: "time-distorted",
            value: true,
            duration: {
              kind: "permanent",
            },
          },
        },
      ],
    },
  },
};

export default chronowarp;
