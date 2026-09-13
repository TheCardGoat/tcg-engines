import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const varuckanAcolyte: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a4dk88zq9o",
  slug: "varuckan-acolyte",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a4dk88zq9o:face:default",
      catalogId: "a4dk88zq9o",
      name: "Varuckan Acolyte",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "On Enter: Destroy target regalia with memory cost 0.  \n\n[Level 3+] Varuckan Acolyte gets +3 POWER.",
      abilities: [
        {
          id: "a4dk88zq9o-a1",
          kind: "triggered",
          text: "On Enter: Destroy target regalia with memory cost 0.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                  kind: "all",
                  filters: [
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
                        operator: "eq",
                        right: 0,
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            bindResultAs: "destroyed-object",
          },
        },
        {
          id: "a4dk88zq9o-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 3+] Varuckan Acolyte gets +3 POWER.",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: 3,
              },
            },
          ],
        },
      ],
    },
  },
};

export default varuckanAcolyte;
