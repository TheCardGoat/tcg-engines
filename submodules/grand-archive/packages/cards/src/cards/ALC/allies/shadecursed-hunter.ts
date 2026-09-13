import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shadecursedHunter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oqk2c7wklz",
  slug: "shadecursed-hunter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oqk2c7wklz:face:default",
      catalogId: "oqk2c7wklz",
      name: "Shadecursed Hunter",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "CURSE", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "Ranged 5, Stealth\n\nOn Death: Put Shadecursed Hunter on the bottom of your champion's lineage.\n\nInherited Effect: This object gets -2 LIFE.",
      abilities: [
        {
          id: "oqk2c7wklz-a1",
          kind: "keyword-group",
          text: "Ranged 5, Stealth",
          keywords: [
            {
              name: "ranged",
              value: 5,
            },
            {
              name: "stealth",
            },
          ],
        },
        {
          id: "oqk2c7wklz-a2",
          kind: "triggered",
          text: "On Death: Put Shadecursed Hunter on the bottom of your champion's lineage.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "inner-lineage",
              host: {
                kind: "champion",
                player: "controller",
              },
              placement: {
                kind: "bottom",
              },
            },
          },
        },
        {
          id: "oqk2c7wklz-a3",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect: This object gets -2 LIFE.",
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "ability-bearer",
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
                property: "life",
                operation: "subtract",
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default shadecursedHunter;
