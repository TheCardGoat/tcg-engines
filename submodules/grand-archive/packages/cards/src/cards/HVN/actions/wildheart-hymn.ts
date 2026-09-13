import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wildheartHymn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f05n4ulo84",
  slug: "wildheart-hymn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f05n4ulo84:face:default",
      catalogId: "f05n4ulo84",
      name: "Wildheart Hymn",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "MELODY"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Until end of turn, whenever an Animal enters the field under your control, put a buff counter on it. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
      abilities: [
        {
          id: "f05n4ulo84-a1",
          kind: "card-resolution",
          text: "Until end of turn, whenever an Animal enters the field under your control, put a buff counter on it. (Allies get +1 POWER and +1 LIFE for each buff counter on them.)",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["ANIMAL"],
                  },
                },
              },
            },
            effect: {
              kind: "add-counter",
              subject: {
                kind: "event-subject",
              },
              counter: "buff",
              amount: 1,
            },
            expires: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default wildheartHymn;
