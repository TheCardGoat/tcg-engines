import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const krustallanArcher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3p6i0iqmyn",
  slug: "krustallan-archer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3p6i0iqmyn:face:default",
      catalogId: "3p6i0iqmyn",
      name: "Krustallan Archer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Ranged 3 (As long as this unit is distant, its attacks get +3 POWER.)\n\nOn Attack: You may banish a card with floating memory from your graveyard. If you do, draw a card and Krustallan Archer becomes distant.",
      abilities: [
        {
          id: "3p6i0iqmyn-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 3 (As long as this unit is distant, its attacks get +3 POWER.)",
          keyword: {
            name: "ranged",
            value: 3,
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
        },
        {
          id: "3p6i0iqmyn-a2",
          kind: "triggered",
          text: "On Attack: You may banish a card with floating memory from your graveyard. If you do, draw a card and Krustallan Archer becomes distant.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "has-keyword",
                        keyword: "floating-memory",
                      },
                    },
                  },
                },
                {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                    {
                      kind: "set-object-state",
                      subject: {
                        kind: "source",
                      },
                      state: "distant",
                      value: true,
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default krustallanArcher;
