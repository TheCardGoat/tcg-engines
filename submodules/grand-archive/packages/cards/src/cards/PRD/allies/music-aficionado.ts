import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const musicAficionado: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FDWU3lJg0u",
  slug: "music-aficionado",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FDWU3lJg0u:face:default",
      catalogId: "FDWU3lJg0u",
      name: "Music Aficionado",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "RESONATOR", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "As long as you've activated a Harmony or Melody card this turn, this card costs 3 less to activate.",
      abilities: [
        {
          id: "FDWU3lJg0u-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you've activated a Harmony or Melody card this turn, this card costs 3 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "history",
                event: "card-activated",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
                minimum: 1,
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default musicAficionado;
