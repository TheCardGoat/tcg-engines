import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const suddenSnow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dxAEI20h8F",
  slug: "sudden-snow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dxAEI20h8F:face:default",
      catalogId: "dxAEI20h8F",
      name: "Sudden Snow",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "You may banish a card with floating memory from your graveyard. If you do, draw a card.\n\nUntil end of turn, allies enter the field rested.",
      abilities: [
        {
          id: "dxAEI20h8F-a1",
          kind: "card-resolution",
          text: "You may banish a card with floating memory from your graveyard. If you do, draw a card.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "has-keyword",
                        keyword: "floating-memory",
                      },
                    },
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              ],
            },
          },
        },
        {
          id: "dxAEI20h8F-a2",
          kind: "card-resolution",
          text: "Until end of turn, allies enter the field rested.",
          effect: {
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            operation: {
              kind: "modify-object-state",
              state: "rested",
              value: true,
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default suddenSnow;
