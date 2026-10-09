import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stavesXUltra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "33mWk4HYLF",
  slug: "staves-x-ultra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "33mWk4HYLF:face:default",
      catalogId: "33mWk4HYLF",
      name: "Staves X Ultra",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ULTIMATE", "VELTECH", "ACCESSORY"],
      },
      elements: ["ARCANE"],
      stats: {},
      rulesText:
        "Sword Weapon Link\n\n[Lorraine Bonus] Linked weapon has spellshroud and gets +1POWER for each static counter on it.\n\n[Lorraine Bonus] [Element Bonus] At the beginning of your end phase, if this card is in your banishment, put a static counter on a Sword weapon you control and each object linked to it.",
      abilities: [
        {
          id: "33mWk4HYLF-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Sword Weapon Link",
          keyword: {
            name: "link",
            target: "sword-weapon",
          },
        },
        {
          id: "33mWk4HYLF-a2",
          kind: "static",
          staticKind: "effects",
          executionSource: "linked-object",
          text: "[Lorraine Bonus] Linked weapon has spellshroud and gets +1POWER for each static counter on it.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Lorraine",
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "spellshroud",
                },
              },
            },
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
                amount: {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: "static",
                },
              },
            },
          ],
        },
        {
          id: "33mWk4HYLF-a3",
          kind: "triggered",
          text: "[Lorraine Bonus] [Element Bonus] At the beginning of your end phase, if this card is in your banishment, put a static counter on a Sword weapon you control and each object linked to it.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Lorraine",
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
          functionalZones: ["banishment"],
          effect: {
            kind: "conditional",
            condition: {
              kind: "source-zone",
              zone: "banishment",
            },
            then: {
              kind: "choose",
              selection: {
                id: "chosen-counter-object",
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
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SWORD"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "chosen-counter-object",
                    },
                    counter: "static",
                    amount: 1,
                  },
                  {
                    kind: "add-counter",
                    subject: {
                      kind: "each",
                      collection: {
                        zones: ["field"],
                        host: {
                          kind: "bound",
                          binding: "chosen-counter-object",
                        },
                        relationship: "linked-to",
                      },
                    },
                    counter: "static",
                    amount: 1,
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default stavesXUltra;
