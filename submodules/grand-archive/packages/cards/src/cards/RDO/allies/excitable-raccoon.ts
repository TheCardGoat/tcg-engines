import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const excitableRaccoon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iM3IywF99T",
  slug: "excitable-raccoon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iM3IywF99T:face:default",
      catalogId: "iM3IywF99T",
      name: "Excitable Raccoon",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "RACCOON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "As long as an opponent has no cards in their graveyard, Excitable Raccoon gets +1POWER and has vigor. (At the beginning of the your end phase, wake up this ally with vigor.)",
      abilities: [
        {
          id: "iM3IywF99T-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as an opponent has no cards in their graveyard, Excitable Raccoon gets +1POWER and has vigor. (At the beginning of the your end phase, wake up this ally with vigor.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-zone-count",
                players: "each-opponent",
                quantifier: "any",
                zone: "graveyard",
                operator: "eq",
                value: 0,
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
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-zone-count",
                players: "each-opponent",
                quantifier: "any",
                zone: "graveyard",
                operator: "eq",
                value: 0,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "vigor",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default excitableRaccoon;
