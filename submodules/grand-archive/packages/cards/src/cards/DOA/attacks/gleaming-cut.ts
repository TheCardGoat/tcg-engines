import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gleamingCut: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qufoIF014c",
  slug: "gleaming-cut",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qufoIF014c:face:default",
      catalogId: "qufoIF014c",
      name: "Gleaming Cut",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 2,
      },
      rulesText:
        "On Attack: Choose and reveal a card in your memory. If the revealed card is luxem element, Gleaming Cut gets +2 POWER.\n\n[Class Bonus] [Element Bonus] Whenever you reveal Gleaming Cut from your memory, you may banish a card named Gleaming Cut from your memory. If you do, draw two cards.",
      abilities: [
        {
          id: "qufoIF014c-a1",
          kind: "triggered",
          text: "On Attack: Choose and reveal a card in your memory. If the revealed card is luxem element, Gleaming Cut gets +2 POWER.",
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
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "revealed-card",
                  },
                  filter: {
                    kind: "element",
                    oneOf: ["LUXEM"],
                  },
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
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
            ],
          },
        },
        {
          id: "qufoIF014c-a2",
          kind: "triggered",
          text: "[Class Bonus] [Element Bonus] Whenever you reveal Gleaming Cut from your memory, you may banish a card named Gleaming Cut from your memory. If you do, draw two cards.",
          trigger: {
            kind: "event",
            event: {
              name: "card-revealed",
              actor: "controller",
              from: "memory",
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
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
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
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "name",
                        value: "Gleaming Cut",
                        match: "exact",
                      },
                    },
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                },
              ],
            },
          },
          functionalZones: ["memory"],
        },
      ],
    },
  },
};

export default gleamingCut;
