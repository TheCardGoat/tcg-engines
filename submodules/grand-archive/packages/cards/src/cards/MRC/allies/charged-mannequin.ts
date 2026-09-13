import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chargedMannequin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "alegbscxwj",
  slug: "charged-mannequin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "alegbscxwj:face:default",
      catalogId: "alegbscxwj",
      name: "Charged Mannequin",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText: "As long as you control a Powercell, Charged Mannequin gets +1 POWER.",
      abilities: [
        {
          id: "alegbscxwj-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control a Powercell, Charged Mannequin gets +1 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["POWERCELL"],
                  },
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

export default chargedMannequin;
