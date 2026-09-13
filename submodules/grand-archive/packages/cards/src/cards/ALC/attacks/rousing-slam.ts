import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rousingSlam: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v5klryvfq3",
  slug: "rousing-slam",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v5klryvfq3:face:default",
      catalogId: "v5klryvfq3",
      name: "Rousing Slam",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] [Level 2+] On Attack: The attacker gains vigor and taunt until the beginning of your next turn. (Units with vigor wake up at the beginning of your end phase.)",
      abilities: [
        {
          id: "v5klryvfq3-a1",
          kind: "triggered",
          text: "[Class Bonus] [Level 2+] On Attack: The attacker gains vigor and taunt until the beginning of your next turn. (Units with vigor wake up at the beginning of your end phase.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "event-attacker",
                },
                affectedSet: "locked",
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "vigor",
                  },
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "event-attacker",
                },
                affectedSet: "locked",
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "taunt",
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

export default rousingSlam;
