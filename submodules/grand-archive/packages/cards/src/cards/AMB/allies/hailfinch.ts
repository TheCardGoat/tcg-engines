import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hailfinch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3XV4QlQXfy",
  slug: "hailfinch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3XV4QlQXfy:face:default",
      catalogId: "3XV4QlQXfy",
      name: "Hailfinch",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "BIRD"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Players can’t declare attacks targeting Hailfinch unless they pay (2) for each attack declaration.\n\n[Class Bonus] On Hit: You may remove a buff counter from Hailfinch. If you do, rest the hit object and it doesn't wake up during its controller's next wake up phase. ",
      abilities: [
        {
          id: "3XV4QlQXfy-a1",
          kind: "static",
          staticKind: "effects",
          text: "Players can’t declare attacks targeting Hailfinch unless they pay (2) for each attack declaration.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "attack",
              subject: {
                kind: "player",
                player: "each-player",
              },
              against: {
                kind: "source",
              },
              cost: {
                kind: "pay-reserve",
                amount: 2,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "3XV4QlQXfy-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: You may remove a buff counter from Hailfinch. If you do, rest the hit object and it doesn't wake up during its controller's next wake up phase.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "hit-object",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "remove-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  amount: 1,
                },
                {
                  kind: "rest",
                  subject: {
                    kind: "bound",
                    binding: "hit-object",
                  },
                },
                {
                  kind: "rule-modification",
                  mode: "forbid",
                  action: "wake",
                  subject: {
                    kind: "bound",
                    binding: "hit-object",
                  },
                  duration: {
                    kind: "until-end-of-next-phase",
                    phase: "wake-up",
                    whose: {
                      controllerOf: "hit-object",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default hailfinch;
