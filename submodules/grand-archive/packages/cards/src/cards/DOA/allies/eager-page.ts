import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eagerPage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jlAc0wWlDZ",
  slug: "eager-page",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jlAc0wWlDZ:face:default",
      catalogId: "jlAc0wWlDZ",
      name: "Eager Page",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "At the beginning of your recollection phase, if you haven't materialized a card this turn, put a buff counter on Eager Page. (Allies get +1 power and +1 life for each buff counter on them.)",
      abilities: [
        {
          id: "jlAc0wWlDZ-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, if you haven't materialized a card this turn, put a buff counter on Eager Page. (Allies get +1 power and +1 life for each buff counter on them.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "history",
                event: "card-materialized",
                window: "this-turn",
                actor: "controller",
                minimum: 1,
              },
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: "buff",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default eagerPage;
