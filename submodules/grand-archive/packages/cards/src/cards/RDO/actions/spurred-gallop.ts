import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spurredGallop: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8iNWBAkqkS",
  slug: "spurred-gallop",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8iNWBAkqkS:face:default",
      catalogId: "8iNWBAkqkS",
      name: "Spurred Gallop",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HORSE", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next Horse ally card you activate this turn can be activated as though it had fast activation.\n\nDraw a card into your memory. The next Horse ally card you activate this turn costs (2) less to activate.",
      abilities: [
        {
          id: "8iNWBAkqkS-a1",
          kind: "card-resolution",
          text: "The next Horse ally card you activate this turn can be activated as though it had fast activation.",
          effect: {
            kind: "rule-modification",
            mode: "allow",
            action: "activate-fast",
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
                {
                  kind: "subtype",
                  oneOf: ["HORSE"],
                },
              ],
            },
            duration: {
              kind: "for-next-event",
              event: "card-activated",
            },
          },
        },
        {
          id: "8iNWBAkqkS-a2",
          kind: "card-resolution",
          text: "Draw a card into your memory. The next Horse ally card you activate this turn costs (2) less to activate.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "rule-modification",
                mode: "modify-cost",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "controller",
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HORSE"],
                    },
                  ],
                },
                costKind: "reserve",
                costOperation: "subtract",
                amount: 2,
                duration: {
                  kind: "for-next-event",
                  event: "card-activated",
                  expires: {
                    kind: "this-turn",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default spurredGallop;
