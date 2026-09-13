import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zanderAlwaysWatching: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tOK1Gr0N8f",
  slug: "zander-always-watching",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tOK1Gr0N8f:face:default",
      catalogId: "tOK1Gr0N8f",
      name: "Zander, Always Watching",
      lineageName: "Zander",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        'Zander Lineage (Zander, Always Watching must be leveled from a previous level "Zander" champion.)\n\nInherited Effect: As long as Zander is attacking a rested unit, Zander\'s attacks get +1 POWER. (Your champion has this ability as long as this card is part of its lineage.)',
      abilities: [
        {
          id: "tOK1Gr0N8f-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Zander Lineage (Zander, Always Watching must be leveled from a previous level "Zander" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Zander",
          },
        },
        {
          id: "tOK1Gr0N8f-a2",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect: As long as Zander is attacking a rested unit, Zander's attacks get +1 POWER. (Your champion has this ability as long as this card is part of its lineage.)",
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "attacks-by",
                attacker: {
                  kind: "ability-bearer",
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "ability-bearer",
                },
                otherFilter: {
                  kind: "object-state",
                  state: "rested",
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

export default zanderAlwaysWatching;
