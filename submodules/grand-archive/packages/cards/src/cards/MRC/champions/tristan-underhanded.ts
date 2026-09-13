import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tristanUnderhanded: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bjlwabipl6",
  slug: "tristan-underhanded",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bjlwabipl6:face:default",
      catalogId: "bjlwabipl6",
      name: "Tristan, Underhanded",
      lineageName: "Tristan",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: You may put a preparation counter on Tristan. If you don’t, you gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
      abilities: [
        {
          id: "bjlwabipl6-a1",
          kind: "triggered",
          text: "On Enter: You may put a preparation counter on Tristan. If you don’t, you gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "preparation",
              amount: 1,
            },
            otherwise: {
              kind: "set-player-state",
              player: "controller",
              state: "agility",
              value: true,
              amount: 3,
              duration: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default tristanUnderhanded;
