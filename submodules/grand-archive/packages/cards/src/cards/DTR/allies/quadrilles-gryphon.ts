import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const quadrillesGryphon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "84e2rfex54",
  slug: "quadrilles-gryphon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "84e2rfex54:face:default",
      catalogId: "84e2rfex54",
      name: "Quadrille's Gryphon",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HUMAN", "BIRD"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Whenever you activate a Melody or Harmony card, put a buff counter on Quadrille's Gryphon. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "84e2rfex54-a1",
          kind: "triggered",
          text: "Whenever you activate a Melody or Harmony card, put a buff counter on Quadrille's Gryphon. (Allies get +1POWER and +1LIFE for each buff counter on them.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["HARMONY", "MELODY"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default quadrillesGryphon;
