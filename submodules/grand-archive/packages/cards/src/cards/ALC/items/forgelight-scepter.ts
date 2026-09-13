import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const forgelightScepter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "smw3rrii17",
  slug: "forgelight-scepter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "smw3rrii17:face:default",
      catalogId: "smw3rrii17",
      name: "Forgelight Scepter",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SCEPTER"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nAt the beginning of each opponent's end phase, if that player has an odd amount of cards in their memory, deal 2 unpreventable damage to their champion.",
      abilities: [
        {
          id: "smw3rrii17-a1",
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
          id: "smw3rrii17-a2",
          kind: "triggered",
          text: "At the beginning of each opponent's end phase, if that player has an odd amount of cards in their memory, deal 2 unpreventable damage to their champion.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "opponent",
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-count-parity",
              collection: {
                zones: ["memory"],
                player: "event-actor",
              },
              value: "odd",
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "champion",
                player: "event-actor",
              },
              amount: 2,
              preventable: false,
            },
          },
        },
      ],
    },
  },
};

export default forgelightScepter;
