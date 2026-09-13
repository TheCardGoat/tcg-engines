import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const radiantOriginOfCleric: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XSgcay9ZB7",
  slug: "radiant-origin-of-cleric",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XSgcay9ZB7:face:default",
      catalogId: "XSgcay9ZB7",
      name: "Radiant Origin of Cleric",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "TRIAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Omnishroud\n\nWhenever you recover, put a training counter on Radiant Origin of Cleric.\n\n[Class Bonus] (4), Sacrifice Radiant Origin of Cleric: Level up your champion. Activate this ability only if there are eight or more training counters on Radiant Origin of Cleric.",
      abilities: [
        {
          id: "XSgcay9ZB7-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Omnishroud",
          keyword: {
            name: "omnishroud",
          },
        },
        {
          id: "XSgcay9ZB7-a2",
          kind: "triggered",
          text: "Whenever you recover, put a training counter on Radiant Origin of Cleric.",
          trigger: {
            kind: "event",
            event: {
              name: "player-recovered",
              actor: "controller",
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
          id: "XSgcay9ZB7-a3",
          kind: "activated",
          text: "[Class Bonus] (4), Sacrifice Radiant Origin of Cleric: Level up your champion. Activate this ability only if there are eight or more training counters on Radiant Origin of Cleric.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
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
              right: 8,
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

export default radiantOriginOfCleric;
