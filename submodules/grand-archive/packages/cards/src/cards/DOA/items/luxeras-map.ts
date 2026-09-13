import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luxerasMap: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s23UHXgcZq",
  slug: "luxeras-map",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s23UHXgcZq:face:default",
      catalogId: "s23UHXgcZq",
      name: "Luxera's Map",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "MAP"],
      },
      elements: ["LUXEM"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize. \n\nLuxera's Map enters the field rested.\n\nREST, Banish Luxera's Map: Search your deck for a card and put it into your memory. Then shuffle your deck. Activate this ability only at slow speed.",
      abilities: [
        {
          id: "s23UHXgcZq-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "s23UHXgcZq-a2",
          kind: "static",
          staticKind: "effects",
          text: "Luxera's Map enters the field rested.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "modify-object-state",
                state: "rested",
                value: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "s23UHXgcZq-a3",
          kind: "activated",
          text: "REST, Banish Luxera's Map: Search your deck for a card and put it into your memory. Then shuffle your deck. Activate this ability only at slow speed.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "search",
                player: "controller",
                zone: "main-deck",
                selection: {
                  id: "searched-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "searched-card",
                },
                from: "main-deck",
                destination: {
                  zone: "memory",
                },
              },
              {
                kind: "shuffle",
                player: "controller",
                zone: "main-deck",
              },
            ],
          },
        },
      ],
    },
  },
};

export default luxerasMap;
