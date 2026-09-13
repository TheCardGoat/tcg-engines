import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sabelaGossamerPenance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pOJ4uRuyMK",
  slug: "sabela-gossamer-penance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pOJ4uRuyMK:face:default",
      catalogId: "pOJ4uRuyMK",
      name: "Sabela, Gossamer Penance",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["CRUX"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Choose a Sword regalia card with memory cost 1 or less from your banishment and put it onto the field. Put a bond counter on it. It gets +2POWER for as long as you control Sabela.\n\nOn Leave: Sacrifice each regalia with a bond counter on it.\n\n",
      abilities: [
        {
          id: "pOJ4uRuyMK-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Choose a Sword regalia card with memory cost 1 or less from your banishment and put it onto the field. Put a bond counter on it. It gets +2POWER for as long as you control Sabela.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-sword-regalia",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["SWORD"],
                    },
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "numeric",
                      comparison: {
                        left: {
                          kind: "property",
                          subject: {
                            kind: "candidate",
                          },
                          property: "memory-cost",
                          basis: "base",
                        },
                        operator: "lte",
                        right: 1,
                      },
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "chosen-sword-regalia",
                  },
                  from: "banishment",
                  destination: {
                    zone: "field",
                  },
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "chosen-sword-regalia",
                  },
                  counter: {
                    named: "bond",
                  },
                  amount: 1,
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "chosen-sword-regalia",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "while-source-on-field",
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
              ],
            },
          },
        },
        {
          id: "pOJ4uRuyMK-a2",
          kind: "triggered",
          text: "On Leave: Sacrifice each regalia with a bond counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "object-left-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "choose",
            selection: {
              id: "sacrificed-object",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                    {
                      kind: "has-counter",
                      counter: {
                        named: "bond",
                      },
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "sacrifice",
              subject: {
                kind: "bound",
                binding: "sacrificed-object",
              },
            },
          },
        },
      ],
    },
  },
};

export default sabelaGossamerPenance;
