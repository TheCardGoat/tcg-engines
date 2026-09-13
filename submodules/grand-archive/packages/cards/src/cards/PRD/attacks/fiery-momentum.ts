import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fieryMomentum: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LUfgfsWTTO",
  slug: "fiery-momentum",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LUfgfsWTTO:face:default",
      catalogId: "LUfgfsWTTO",
      name: "Fiery Momentum",
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
      elements: ["FIRE"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] Fiery Momentum gets +1 POWER for each fire element card in your graveyard. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "LUfgfsWTTO-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Fiery Momentum gets +1 POWER for each fire element card in your graveyard. (Apply this effect only if your champion's class matches this card's class.)",
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
                  kind: "count",
                  collection: {
                    zones: ["graveyard"],
                    player: "controller",
                    filter: {
                      kind: "element",
                      oneOf: ["FIRE"],
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

export default fieryMomentum;
