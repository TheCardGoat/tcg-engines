import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fabledRubyFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mzf5dmpqbc",
  slug: "fabled-ruby-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "mzf5dmpqbc:face:default",
      catalogId: "mzf5dmpqbc",
      name: "Fabled Ruby Fatestone",
      cost: {
        kind: "memory",
        amount: 7,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Immortality, Spellshroud\n\n[Guo Jia Bonus] At the beginning of your recollection phase, deal 1 damage to each champion.\n\n[Guo Jia Bonus] Whenever non-combat damage is dealt to one or more units by a fire element source you control, put a quest counter on your champion.\n\nREST: You may remove seven quest counters from your champion. If you do, wake up and transform Fabled Ruby Fatestone.",
      abilities: [
        {
          id: "mzf5dmpqbc-a1",
          kind: "keyword-group",
          text: "Immortality, Spellshroud",
          keywords: [
            {
              name: "immortality",
            },
            {
              name: "spellshroud",
            },
          ],
        },
        {
          id: "mzf5dmpqbc-a2",
          kind: "triggered",
          text: "[Guo Jia Bonus] At the beginning of your recollection phase, deal 1 damage to each champion.",
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
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            amount: 1,
          },
        },
        {
          id: "mzf5dmpqbc-a3",
          kind: "triggered",
          text: "[Guo Jia Bonus] Whenever non-combat damage is dealt to one or more units by a fire element source you control, put a quest counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
              },
              recipient: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              combatDamage: false,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: {
              named: "quest",
            },
            amount: 1,
          },
        },
        {
          id: "mzf5dmpqbc-a4",
          kind: "activated",
          text: "REST: You may remove seven quest counters from your champion. If you do, wake up and transform Fabled Ruby Fatestone.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
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
                  kind: "remove-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: {
                    named: "quest",
                  },
                  amount: 7,
                  bindResultAs: "removed-counters",
                },
                {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "wake",
                      subject: {
                        kind: "source",
                      },
                    },
                    {
                      kind: "transform",
                      subject: {
                        kind: "source",
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
    flipFace: {
      id: "mzf5dmpqbc:face:flip",
      catalogId: "zth3uamdjb",
      name: "Suzaku, Vermillion Phoenix",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SHENJU", "FATEBOUND", "PHOENIX"],
      },
      elements: ["FIRE"],
      stats: {
        power: 4,
        life: 3,
      },
      rulesText:
        "Spellshroud\n\n[Guo Jia Bonus] On Banish: You may banish three fire element cards from your graveyard. If you do, return Suzaku to the field transformed. (It enters as Suzaku, Vermillion Phoenix.)",
      abilities: [
        {
          id: "zth3uamdjb-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Spellshroud",
          keyword: {
            name: "spellshroud",
          },
        },
        {
          id: "zth3uamdjb-a2",
          kind: "triggered",
          text: "[Guo Jia Bonus] On Banish: You may banish three fire element cards from your graveyard. If you do, return Suzaku to the field transformed. (It enters as Suzaku, Vermillion Phoenix.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
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
                    id: "banished-fire-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 3,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                    },
                  },
                },
                {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  from: "banishment",
                  destination: {
                    zone: "field",
                    face: "transformed",
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

export default fabledRubyFatestone;
