import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const treacleDrownedMouse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6emPe9OEUn",
  slug: "treacle-drowned-mouse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6emPe9OEUn:face:default",
      catalogId: "6emPe9OEUn",
      name: "Treacle, Drowned Mouse",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "ANIMAL", "MOUSE"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "As long as Treacle is ephemeral, it has stealth.\n\n[Alice Bonus] At the beginning of your recollection phase, recover X, where X is the amount of Specter allies you control.\n\n[Alice Bonus] Ephemerate — (2), Discard a card. (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
      abilities: [
        {
          id: "6emPe9OEUn-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Treacle is ephemeral, it has stealth.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
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
                  name: "stealth",
                },
              },
            },
          ],
        },
        {
          id: "6emPe9OEUn-a2",
          kind: "triggered",
          text: "[Alice Bonus] At the beginning of your recollection phase, recover X, where X is the amount of Specter allies you control.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SPECTER"],
                      },
                    ],
                  },
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
        {
          id: "6emPe9OEUn-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Alice Bonus] Ephemerate — (2), Discard a card. (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "all",
              costs: [
                {
                  kind: "pay-reserve",
                  amount: 2,
                },
                {
                  kind: "select-and-move",
                  player: "controller",
                  from: "hand",
                  to: "graveyard",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                },
              ],
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
        },
      ],
    },
  },
};

export default treacleDrownedMouse;
