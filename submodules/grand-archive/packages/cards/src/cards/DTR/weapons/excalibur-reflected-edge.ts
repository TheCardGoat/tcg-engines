import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const excaliburReflectedEdge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "u1a1s4ys44",
  slug: "excalibur-reflected-edge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "u1a1s4ys44:face:default",
      catalogId: "u1a1s4ys44",
      name: "Excalibur, Reflected Edge",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["WEAPON"],
        classes: ["ASSASSIN", "MAGE"],
        subtypes: ["ASSASSIN", "MAGE", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "True Sight, Spellshroud\n\n[Merlin Bonus] Excalibur gets +1POWER.\n\nOn Destroy: Summon a token copy of a non-Distortion regalia you control with memory cost 0. It becomes a Distortion in addition to its other types.",
      abilities: [
        {
          id: "u1a1s4ys44-a1",
          kind: "keyword-group",
          text: "True Sight, Spellshroud",
          keywords: [
            {
              name: "true-sight",
            },
            {
              name: "spellshroud",
            },
          ],
        },
        {
          id: "u1a1s4ys44-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Merlin Bonus] Excalibur gets +1POWER.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
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
                amount: 1,
              },
            },
          ],
        },
        {
          id: "u1a1s4ys44-a3",
          kind: "triggered",
          text: "On Destroy: Summon a token copy of a non-Distortion regalia you control with memory cost 0. It becomes a Distortion in addition to its other types.",
          trigger: {
            kind: "event",
            event: {
              name: "object-destroyed",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-regalia",
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
                      kind: "not",
                      filter: {
                        kind: "subtype",
                        oneOf: ["DISTORTION"],
                      },
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
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "summon",
                  controller: "controller",
                  copyOf: {
                    kind: "bound",
                    binding: "chosen-regalia",
                  },
                  bindResultAs: "summoned-distortion",
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "bound",
                    binding: "summoned-distortion",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
                  },
                  layer: {
                    layer: "B",
                    modifies: "type",
                  },
                  change: {
                    kind: "add-characteristic",
                    characteristic: {
                      kind: "subtype",
                      value: "DISTORTION",
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

export default excaliburReflectedEdge;
