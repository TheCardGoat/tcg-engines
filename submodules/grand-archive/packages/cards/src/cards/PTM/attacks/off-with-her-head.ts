import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const offWithHerHead: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "deO56qXfbP",
  slug: "off-with-her-head",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "deO56qXfbP:face:default",
      catalogId: "deO56qXfbP",
      name: "Off With Her Head",
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
        power: 2,
      },
      rulesText:
        "As long as the attacker is attacking a unique ally, Off With Her Head gets +3POWER.",
      abilities: [
        {
          id: "deO56qXfbP-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as the attacker is attacking a unique ally, Off With Her Head gets +3POWER.",
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
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "supertype",
                      oneOf: ["UNIQUE"],
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
                amount: 3,
              },
            },
          ],
        },
      ],
    },
  },
};

export default offWithHerHead;
