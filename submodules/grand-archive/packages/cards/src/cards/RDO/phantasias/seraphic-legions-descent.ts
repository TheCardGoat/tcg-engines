import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seraphicLegionsDescent: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "QX72P4Xx1A",
  slug: "seraphic-legions-descent",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "QX72P4Xx1A:face:default",
      catalogId: "QX72P4Xx1A",
      name: "Seraphic Legion's Descent",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ANGEL", "SPELL"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "On Enter: Search your deck for any amount of Angel ally cards. Banish those cards along with any amount of Angel ally cards from your hand, memory, and/or graveyard. Shuffle your deck. Then draw a card into your memory for each card banished from your hand and memory this way.\n\n[Level 3+] (1), REST: Until end of turn, you may activate target card banished by Seraphic Legion's Descent.",
      abilities: [
        {
          id: "QX72P4Xx1A-a1",
          kind: "triggered",
          text: "On Enter: Search your deck for any amount of Angel ally cards. Banish those cards along with any amount of Angel ally cards from your hand, memory, and/or graveyard. Shuffle your deck. Then draw a card into your memory for each card banished from your hand and memory this way.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "search",
                player: "controller",
                zone: "main-deck",
                selection: {
                  id: "searched-angels",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["ANGEL"],
                        },
                      ],
                    },
                  },
                },
                reveal: true,
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "searched-angels",
                },
                from: "main-deck",
                destination: {
                  zone: "banishment",
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "hand-memory-angels",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["hand", "memory"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["ANGEL"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "hand-memory-angels",
                  },
                  destination: {
                    zone: "banishment",
                  },
                  bindResultAs: "banished-hand-memory-count",
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "graveyard-angels",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["graveyard"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["ANGEL"],
                        },
                      ],
                    },
                  },
                },
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "graveyard-angels",
                  },
                  from: "graveyard",
                  destination: {
                    zone: "banishment",
                  },
                },
              },
              {
                kind: "shuffle",
                player: "controller",
                zone: "main-deck",
              },
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "binding-count",
                  binding: "banished-hand-memory-count",
                },
                to: "memory",
              },
            ],
          },
        },
        {
          id: "QX72P4Xx1A-a2",
          kind: "activated",
          text: "[Level 3+] (1), REST: Until end of turn, you may activate target card banished by Seraphic Legion's Descent.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          targets: [
            {
              id: "target-banished-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "banished-by",
                host: {
                  kind: "source",
                },
              },
            },
          ],
          restrictions: [
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
                  right: 3,
                },
              },
            },
          ],
          effect: {
            kind: "rule-modification",
            mode: "allow",
            action: "activate",
            subject: {
              kind: "bound",
              binding: "target-banished-card",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default seraphicLegionsDescent;
