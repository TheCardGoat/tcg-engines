import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const takeAim: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vnta6qsesw",
  slug: "take-aim",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vnta6qsesw:face:default",
      catalogId: "vnta6qsesw",
      name: "Take Aim",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target unit's next attack this turn gets +2 POWER. Class Bonus: That unit also gains ranged 2 until end of turn. (As long as that unit is distant, that unit's attacks get +2 POWER. Apply the additional effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "vnta6qsesw-a1",
          kind: "card-resolution",
          text: "Target unit's next attack this turn gets +2 POWER. Class Bonus: That unit also gains ranged 2 until end of turn. (As long as that unit is distant, that unit's attacks get +2 POWER. Apply the additional effect only if your champion's class matches this card's class.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-declared",
                    subject: {
                      kind: "bound-object",
                      binding: "target-1",
                    },
                  },
                },
                limit: 1,
                expires: {
                  kind: "this-turn",
                },
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "add",
                    amount: 2,
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "champion-matches-source",
                  characteristic: "class",
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "ranged",
                      value: 2,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default takeAim;
