import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aqueousEnchanting: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fMv7tIOZwL",
  slug: "aqueous-enchanting",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fMv7tIOZwL:face:default",
      catalogId: "fMv7tIOZwL",
      name: "Aqueous Enchanting",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Allies you control get your choice of +1 POWER or +1 LIFE until end of turn.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "fMv7tIOZwL-a1",
          kind: "card-resolution",
          text: "Allies you control get your choice of +1 POWER or +1 LIFE until end of turn.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "choice-1",
                text: "+1 POWER",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
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
              },
              {
                id: "choice-2",
                text: "+1 LIFE",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
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
                    amount: 1,
                  },
                },
              },
            ],
          },
        },
        {
          id: "fMv7tIOZwL-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
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
        },
      ],
    },
  },
};

export default aqueousEnchanting;
