import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lorraineSpiritRuler: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n2TKqNaODR",
  slug: "lorraine-spirit-ruler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n2TKqNaODR:face:default",
      catalogId: "n2TKqNaODR",
      name: "Lorraine, Spirit Ruler",
      lineageName: "Lorraine",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["CRUX"],
      stats: {
        level: 3,
        life: 28,
      },
      rulesText:
        'Lorraine Lineage (Lorraine, Spirit Ruler must be leveled from a previous level "Lorraine" champion.)\n\nOn Enter: Choose a Sword regalia card with memory cost 1 or less from your banishment and put it onto the field. It enters the field with three additional durability counters on it.',
      abilities: [
        {
          id: "n2TKqNaODR-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Lorraine Lineage (Lorraine, Spirit Ruler must be leveled from a previous level "Lorraine" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Lorraine",
          },
        },
        {
          id: "n2TKqNaODR-a2",
          kind: "triggered",
          text: "On Enter: Choose a Sword regalia card with memory cost 1 or less from your banishment and put it onto the field. It enters the field with three additional durability counters on it.",
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
                  kind: "replacement",
                  event: {
                    name: "object-entered-field",
                    subject: {
                      kind: "bound-object",
                      binding: "chosen-sword-regalia",
                    },
                  },
                  operation: {
                    kind: "add-object-counters",
                    counters: [
                      {
                        counter: "durability",
                        amount: 3,
                      },
                    ],
                  },
                  duration: {
                    kind: "for-next-event",
                    event: "object-entered-field",
                    expires: {
                      kind: "this-turn",
                    },
                  },
                },
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
              ],
            },
          },
        },
      ],
    },
  },
};

export default lorraineSpiritRuler;
