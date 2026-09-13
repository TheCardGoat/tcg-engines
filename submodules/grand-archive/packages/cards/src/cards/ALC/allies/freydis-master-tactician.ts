import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const freydisMasterTactician: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7dedg616r0",
  slug: "freydis-master-tactician",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7dedg616r0:face:default",
      catalogId: "7dedg616r0",
      name: "Freydis, Master Tactician",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] At the beginning of your recollection phase, put a tactic counter on Freydis, then glimpse X where X is the amount of tactic counters on Freydis. \n\nRemove three tactic counters from Freydis: For the rest of the game, Ranger units you control are always distant. ",
      abilities: [
        {
          id: "7dedg616r0-a1",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, put a tactic counter on Freydis, then glimpse X where X is the amount of tactic counters on Freydis.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
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
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "tactic",
                },
                amount: 1,
              },
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "tactic",
                  },
                },
              },
            ],
          },
        },
        {
          id: "7dedg616r0-a2",
          kind: "activated",
          text: "Remove three tactic counters from Freydis: For the rest of the game, Ranger units you control are always distant.",
          activation: "ability",
          cost: {
            kind: "remove-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "tactic",
            },
            amount: 3,
          },
          effect: {
            kind: "continuous-player-state",
            players: "controller",
            state: {
              named: "ranger-units-always-distant",
            },
            value: true,
            duration: {
              kind: "permanent",
            },
          },
        },
      ],
    },
  },
};

export default freydisMasterTactician;
