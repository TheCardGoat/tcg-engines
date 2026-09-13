import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nightshade: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "rzk3mjblse",
  slug: "nightshade",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "rzk3mjblse:face:default",
      catalogId: "rzk3mjblse",
      name: "Nightshade",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FLOWER"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, put a wither counter on target non-champion non-token object you control. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
      abilities: [
        {
          id: "rzk3mjblse-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, put a wither counter on target non-champion non-token object you control. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "token",
                      value: false,
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "wither",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default nightshade;
