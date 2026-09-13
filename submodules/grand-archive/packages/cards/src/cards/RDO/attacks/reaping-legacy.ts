import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reapingLegacy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XDVIiIfKZk",
  slug: "reaping-legacy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XDVIiIfKZk:face:default",
      catalogId: "XDVIiIfKZk",
      name: "Reaping Legacy",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] Reaping Legacy gets +1POWER for each Sword regalia weapon card in your banishment.",
      abilities: [
        {
          id: "XDVIiIfKZk-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Reaping Legacy gets +1POWER for each Sword regalia weapon card in your banishment.",
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
                        {
                          kind: "subtype",
                          oneOf: ["SWORD"],
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

export default reapingLegacy;
