import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cloakOfStillwater: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2ha4dk88zq",
  slug: "cloak-of-stillwater",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2ha4dk88zq:face:default",
      catalogId: "2ha4dk88zq",
      name: "Cloak of Stillwater",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ACCESSORY"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "[Class Bonus] On Enter: Draw a card. \n\nREST, Banish a card with floating memory from your graveyard: Prevent the next 3 damage that would be dealt to your champion this turn.",
      abilities: [
        {
          id: "2ha4dk88zq-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "2ha4dk88zq-a2",
          kind: "activated",
          text: "REST, Banish a card with floating memory from your graveyard: Prevent the next 3 damage that would be dealt to your champion this turn.",
          activation: "ability",
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
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "has-keyword",
                  keyword: "floating-memory",
                },
              },
            ],
          },
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 3,
              scope: "replacement-instance",
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

export default cloakOfStillwater;
