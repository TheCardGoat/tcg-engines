import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const radiantOriginOfWarrior: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lqILsIDHNc",
  slug: "radiant-origin-of-warrior",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lqILsIDHNc:face:default",
      catalogId: "lqILsIDHNc",
      name: "Radiant Origin of Warrior",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "TRIAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Omnishroud\n\nWhenever your champion attacks using a weapon, put a training counter on Radiant Origin of Warrior.\n\n[Class Bonus] (3), Sacrifice Radiant Origin of Warrior: Level up your champion. Activate this ability only if there are four or more training counters on Radiant Origin of Warrior.",
      abilities: [
        {
          id: "lqILsIDHNc-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Omnishroud",
          keyword: {
            name: "omnishroud",
          },
        },
        {
          id: "lqILsIDHNc-a2",
          kind: "triggered",
          text: "Whenever your champion attacks using a weapon, put a training counter on Radiant Origin of Warrior.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
              using: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["WEAPON"],
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
          id: "lqILsIDHNc-a3",
          kind: "activated",
          text: "[Class Bonus] (3), Sacrifice Radiant Origin of Warrior: Level up your champion. Activate this ability only if there are four or more training counters on Radiant Origin of Warrior.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
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

export default radiantOriginOfWarrior;
