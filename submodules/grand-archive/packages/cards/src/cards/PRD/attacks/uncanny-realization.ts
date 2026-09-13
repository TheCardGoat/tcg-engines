import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const uncannyRealization: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Nr5GpfLNrh",
  slug: "uncanny-realization",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Nr5GpfLNrh:face:default",
      catalogId: "Nr5GpfLNrh",
      name: "Uncanny Realization",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "AUTOMATON", "COMMAND"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "Command Automaton (An Automaton ally you control performs this attack.)\n\nAs long as a unique ally is attacking with Uncanny Realization, it gets +2POWER.",
      abilities: [
        {
          id: "Nr5GpfLNrh-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Automaton (An Automaton ally you control performs this attack.)",
          keyword: {
            name: "command",
            subtype: "Automaton",
          },
        },
        {
          id: "Nr5GpfLNrh-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as a unique ally is attacking with Uncanny Realization, it gets +2POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "candidate",
                },
                using: {
                  kind: "source",
                },
              },
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
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default uncannyRealization;
