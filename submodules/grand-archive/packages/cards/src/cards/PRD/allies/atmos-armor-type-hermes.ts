import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const atmosArmorTypeHermes: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dlx7mdk0xh",
  slug: "atmos-armor-type-hermes",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dlx7mdk0xh:face:default",
      catalogId: "dlx7mdk0xh",
      name: "Atmos Armor Type-Hermes",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "As an additional cost to activate this card, sacrifice a Powercell.\n\nSpellshroud (Units with spellshroud can’t be targeted by Spells.)\n\n[Level 1+] Other Automaton allies you control get +1 POWER.",
      abilities: [
        {
          id: "dlx7mdk0xh-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a Powercell.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["POWERCELL"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "dlx7mdk0xh-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Spellshroud (Units with spellshroud can’t be targeted by Spells.)",
          keyword: {
            name: "spellshroud",
          },
        },
        {
          id: "dlx7mdk0xh-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] Other Automaton allies you control get +1 POWER.",
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
                  right: 1,
                },
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["AUTOMATON"],
                          },
                        ],
                      },
                      {
                        kind: "not-source",
                      },
                    ],
                  },
                },
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
      ],
    },
  },
};

export default atmosArmorTypeHermes;
