import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chargedAlchemist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v4vm4kj3q2",
  slug: "charged-alchemist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v4vm4kj3q2:face:default",
      catalogId: "v4vm4kj3q2",
      name: "Charged Alchemist",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] As long as you control a Powercell, Charged Alchemist gets +1 POWER and your champion gets +1 level. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "v4vm4kj3q2-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you control a Powercell, Charged Alchemist gets +1 POWER and your champion gets +1 level. (Apply this effect only if your champion’s class matches this card’s class.)",
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
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
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
                property: "level",
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

export default chargedAlchemist;
