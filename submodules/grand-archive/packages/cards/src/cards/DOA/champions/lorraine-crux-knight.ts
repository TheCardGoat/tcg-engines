import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lorraineCruxKnight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NfbZ0nouSQ",
  slug: "lorraine-crux-knight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NfbZ0nouSQ:face:default",
      catalogId: "NfbZ0nouSQ",
      name: "Lorraine, Crux Knight",
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
        'Lorraine Lineage (Lorraine, Crux Knight must be leveled from a previous level "Lorraine" champion.)\n\nLorraine\'s attacks get +1 POWER for each regalia weapon card in your banishment. ',
      abilities: [
        {
          id: "NfbZ0nouSQ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Lorraine Lineage (Lorraine, Crux Knight must be leveled from a previous level "Lorraine" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Lorraine",
          },
        },
        {
          id: "NfbZ0nouSQ-a2",
          kind: "static",
          staticKind: "effects",
          text: "Lorraine's attacks get +1 POWER for each regalia weapon card in your banishment.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "attacks-by",
                attacker: {
                  kind: "source",
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["banishment"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["WEAPON"],
                        },
                        {
                          kind: "supertype",
                          oneOf: ["REGALIA"],
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default lorraineCruxKnight;
