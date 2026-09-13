import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crowdsFavor: GrandArchiveCard<GrandArchiveAbilityDefinition, "status-representation"> =
  {
    canonicalId: "gpmJdGYqoC",
    slug: "crowds-favor",
    definitionKind: "status-representation",
    formatRestriction: {
      kind: "pantheon-only",
      source: "printed-border-tag",
    },
    layout: {
      kind: "single-faced",
      face: {
        id: "gpmJdGYqoC:face:default",
        catalogId: "gpmJdGYqoC",
        name: "Crowd's Favor",
        cost: {
          kind: "none",
        },
        typeLine: {
          supertypes: [],
          types: ["STATUS"],
          classes: ["WARRIOR"],
          subtypes: ["WARRIOR", "SKILL"],
        },
        elements: ["NORM"],
        stats: {},
        rulesText:
          "Whenever an opponent gains the Crowd's Favor status, you lose this status.\n\nPlayers can't declare attacks targeting an object you control unless they pay (1) for each attack declaration.\n\nWhenever an activation, materialization, or trigger targets an object you control, you may negate it unless its controller pays (1).",
        abilities: [
          {
            id: "gpmJdGYqoC-a1",
            kind: "triggered",
            text: "Whenever an opponent gains the Crowd's Favor status, you lose this status.",
            trigger: {
              kind: "event",
              event: {
                name: "player-state-changed",
                actor: "opponent",
                state: "crowds-favor",
                to: true,
              },
            },
            effect: {
              kind: "set-player-state",
              player: "controller",
              state: {
                kind: "event-state",
              },
              value: false,
            },
          },
          {
            id: "gpmJdGYqoC-a2",
            kind: "static",
            staticKind: "effects",
            text: "Players can't declare attacks targeting an object you control unless they pay (1) for each attack declaration.",
            effects: [
              {
                kind: "rule-modification",
                mode: "add-cost",
                action: "declare-target",
                subject: {
                  kind: "player",
                  player: "each-player",
                },
                against: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                  },
                },
                cost: {
                  kind: "pay-reserve",
                  amount: 1,
                },
                duration: {
                  kind: "while-source-in-functional-zone",
                },
              },
            ],
          },
          {
            id: "gpmJdGYqoC-a3",
            kind: "triggered",
            text: "Whenever an activation, materialization, or trigger targets an object you control, you may negate it unless its controller pays (1).",
            trigger: {
              kind: "event",
              event: {
                name: "stack-item-targets-declared",
                itemTypes: ["ability", "card-activation", "materialization"],
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                },
              },
            },
            effect: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "unless-paid",
                player: "event-actor",
                cost: {
                  kind: "pay-reserve",
                  amount: 1,
                },
                otherwise: {
                  kind: "negate",
                  subject: {
                    kind: "event-subject",
                  },
                },
              },
            },
          },
        ],
      },
    },
  };

export default crowdsFavor;
