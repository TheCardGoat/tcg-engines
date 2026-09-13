import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dormantSacrificialAltar: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "px8jypwc8t",
  slug: "dormant-sacrificial-altar",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "px8jypwc8t:face:default",
      catalogId: "px8jypwc8t",
      name: "Dormant Sacrificial Altar",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CROSSROADS"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: Draw a card into your memory.\n\nSacrifice an Automaton ally and a Human ally: Put the top two cards of your deck into your graveyard.",
      abilities: [
        {
          id: "px8jypwc8t-a1",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "px8jypwc8t-a2",
          kind: "activated",
          text: "Sacrifice an Automaton ally and a Human ally: Put the top two cards of your deck into your graveyard.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object-1",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AUTOMATON"],
                    },
                  ],
                },
              },
              {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object-2",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HUMAN"],
                    },
                  ],
                },
              },
            ],
          },
          effect: {
            kind: "mill",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default dormantSacrificialAltar;
