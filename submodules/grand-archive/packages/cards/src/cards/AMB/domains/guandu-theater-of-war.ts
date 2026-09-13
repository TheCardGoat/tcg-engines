import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const guanduTheaterOfWar: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "95ynk6lmnf",
  slug: "guandu-theater-of-war",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "95ynk6lmnf:face:default",
      catalogId: "95ynk6lmnf",
      name: "Guandu, Theater of War",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "CASTLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever you declare an attack with an ally, put a battle counter on Guandu and glimpse 1. If this is the third time this ability has resolved this turn, draw a card into your memory. \n\nUpkeep — At the beginning of your recollection phase, remove two battle counters from Guandu. If you don't, sacrifice Guandu.",
      abilities: [
        {
          id: "95ynk6lmnf-a1",
          kind: "triggered",
          text: "Whenever you declare an attack with an ally, put a battle counter on Guandu and glimpse 1. If this is the third time this ability has resolved this turn, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "battle",
                },
                amount: 1,
              },
              {
                kind: "keyword-action",
                action: "glimpse",
                player: "controller",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "ability-resolution-count",
                  ability: "this",
                  scope: "source-instance",
                  window: "this-turn",
                  operator: "eq",
                  value: 3,
                  includesCurrent: true,
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
        {
          id: "95ynk6lmnf-a2",
          kind: "triggered",
          text: "Upkeep — At the beginning of your recollection phase, remove two battle counters from Guandu. If you don't, sacrifice Guandu.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "unless-performed",
            player: "controller",
            alternative: {
              kind: "remove-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "battle",
              },
              amount: 2,
            },
            otherwise: {
              kind: "sacrifice",
              subject: {
                kind: "source",
              },
            },
          },
          label: {
            name: "Upkeep",
          },
        },
      ],
    },
  },
};

export default guanduTheaterOfWar;
