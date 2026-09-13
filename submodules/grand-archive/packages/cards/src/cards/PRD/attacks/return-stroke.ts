import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const returnStroke: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TZym0IOInK",
  slug: "return-stroke",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TZym0IOInK:face:default",
      catalogId: "TZym0IOInK",
      name: "Return Stroke",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] Return Stroke gets +LVPOWER. (LV refers to your champion's level.)\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "TZym0IOInK-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Return Stroke gets +LVPOWER. (LV refers to your champion's level.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
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
                amount: {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
              },
            },
          ],
        },
        {
          id: "TZym0IOInK-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default returnStroke;
