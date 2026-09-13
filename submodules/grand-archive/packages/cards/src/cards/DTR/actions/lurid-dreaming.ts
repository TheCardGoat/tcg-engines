import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luridDreaming: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ps8unuy20m",
  slug: "lurid-dreaming",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ps8unuy20m:face:default",
      catalogId: "ps8unuy20m",
      name: "Lurid Dreaming",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during an opponent's end phase. \n\nWake up your champion. If you do, draw a card into your memory.",
      abilities: [
        {
          id: "ps8unuy20m-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent's end phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "end",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ps8unuy20m-a2",
          kind: "card-resolution",
          text: "Wake up your champion. If you do, draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "wake",
                  subject: {
                    kind: "champion",
                    player: "controller",
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

export default luridDreaming;
