import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sablierGuard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tu7jvjf2gh",
  slug: "sablier-guard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tu7jvjf2gh:face:default",
      catalogId: "tu7jvjf2gh",
      name: "Sablier Guard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Sablier Guard gets +1POWER and +1LIFE for each omen you have with different reserve costs. (An omen is a card in a banishment with an omen counter on it.)",
      abilities: [
        {
          id: "tu7jvjf2gh-a1",
          kind: "static",
          staticKind: "effects",
          text: "Sablier Guard gets +1POWER and +1LIFE for each omen you have with different reserve costs. (An omen is a card in a banishment with an omen counter on it.)",
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
                      kind: "has-counter",
                      counter: "omen",
                    },
                  },
                  distinctBy: "reserve-cost",
                },
              },
            },
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
                property: "life",
                operation: "add",
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["banishment"],
                    player: "controller",
                    filter: {
                      kind: "has-counter",
                      counter: "omen",
                    },
                  },
                  distinctBy: "reserve-cost",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default sablierGuard;
