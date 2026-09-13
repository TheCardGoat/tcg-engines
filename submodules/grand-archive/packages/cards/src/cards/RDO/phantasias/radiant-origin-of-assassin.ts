import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const radiantOriginOfAssassin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "T5ZEoIRdZr",
  slug: "radiant-origin-of-assassin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "T5ZEoIRdZr:face:default",
      catalogId: "T5ZEoIRdZr",
      name: "Radiant Origin of Assassin",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "TRIAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Omnishroud\n\nWhenever you activate a prepared card, put a training counter on Radiant Origin of Assassin.\n\n[Class Bonus] (5), Sacrifice Radiant Origin of Assassin: Level up your champion. Activate this ability only if there are four or more training counters on Radiant Origin of Assassin.",
      abilities: [
        {
          id: "T5ZEoIRdZr-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Omnishroud",
          keyword: {
            name: "omnishroud",
          },
        },
        {
          id: "T5ZEoIRdZr-a2",
          kind: "triggered",
          text: "Whenever you activate a prepared card, put a training counter on Radiant Origin of Assassin.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "activation-state",
                  state: "prepared",
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "training",
            },
            amount: 1,
          },
        },
        {
          id: "T5ZEoIRdZr-a3",
          kind: "activated",
          text: "[Class Bonus] (5), Sacrifice Radiant Origin of Assassin: Level up your champion. Activate this ability only if there are four or more training counters on Radiant Origin of Assassin.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 5,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "training",
                },
              },
              operator: "gte",
              right: 4,
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
            kind: "level-up",
            subject: {
              kind: "champion",
              player: "controller",
            },
          },
        },
      ],
    },
  },
};

export default radiantOriginOfAssassin;
