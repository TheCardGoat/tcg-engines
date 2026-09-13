import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const automatonForgewarden: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XOfDNzX4ck",
  slug: "automaton-forgewarden",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XOfDNzX4ck:face:default",
      catalogId: "XOfDNzX4ck",
      name: "Automaton Forgewarden",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["NEOS"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Automaton Forgewarden gets +1POWER and +1LIFE for each of up to three tokens you control.",
      abilities: [
        {
          id: "XOfDNzX4ck-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Automaton Forgewarden gets +1POWER and +1LIFE for each of up to three tokens you control.",
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
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "token",
                      value: true,
                    },
                  },
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
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "token",
                      value: true,
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

export default automatonForgewarden;
