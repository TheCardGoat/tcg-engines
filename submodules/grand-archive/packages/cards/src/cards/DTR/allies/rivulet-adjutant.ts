import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rivuletAdjutant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y547d3iixm",
  slug: "rivulet-adjutant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y547d3iixm:face:default",
      catalogId: "y547d3iixm",
      name: "Rivulet Adjutant",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Taunt (While awake, this ally must be targeted before other objects you control during your opponents' attack declarations if able.)\n\nOn Death: Banish Rivulet Adjutant and put an omen counter on it.",
      abilities: [
        {
          id: "y547d3iixm-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Taunt (While awake, this ally must be targeted before other objects you control during your opponents' attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
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
        },
        {
          id: "y547d3iixm-a2",
          kind: "triggered",
          text: "On Death: Banish Rivulet Adjutant and put an omen counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish-object",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "event-subject",
                },
                counter: "omen",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default rivuletAdjutant;
