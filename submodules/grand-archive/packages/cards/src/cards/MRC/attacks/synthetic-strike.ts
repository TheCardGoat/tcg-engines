import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const syntheticStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7nau5sw9f8",
  slug: "synthetic-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7nau5sw9f8:face:default",
      catalogId: "7nau5sw9f8",
      name: "Synthetic Strike",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "As long as the attacker is attacking an Automaton unit, Synthetic Strike gets +1 POWER.",
      abilities: [
        {
          id: "7nau5sw9f8-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as the attacker is attacking an Automaton unit, Synthetic Strike gets +1 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "event-attacker",
                },
                otherFilter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AUTOMATON"],
                    },
                  ],
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default syntheticStrike;
