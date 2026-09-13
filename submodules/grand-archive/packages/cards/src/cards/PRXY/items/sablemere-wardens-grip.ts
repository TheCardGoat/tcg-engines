import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sablemereWardensGrip: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WAodKSuGuX",
  slug: "sablemere-wardens-grip",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "WAodKSuGuX:face:default",
      catalogId: "WAodKSuGuX",
      name: "Sablemere, Warden's Grip",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "GLOVES"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "[Nico Bonus] As long as an opponent has three or more cards in their graveyard, you may pay (3) to activate this card from your material deck.\n\n[Nico Bonus] (3+X), Banish Sablemere: Generate an Icebound Slam card and put it into your memory. Then put X lash counters on your champion.",
      abilities: [
        {
          id: "WAodKSuGuX-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Nico Bonus] As long as an opponent has three or more cards in their graveyard, you may pay (3) to activate this card from your material deck.",
          functionalZones: ["material-deck"],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Nico",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              condition: {
                kind: "player-zone-count",
                players: "each-opponent",
                quantifier: "any",
                zone: "graveyard",
                operator: "gte",
                value: 3,
              },
              cost: {
                kind: "pay-reserve",
                amount: 3,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "WAodKSuGuX-a2",
          kind: "activated",
          text: "[Nico Bonus] (3+X), Banish Sablemere: Generate an Icebound Slam card and put it into your memory. Then put X lash counters on your champion.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    3,
                    {
                      kind: "variable",
                      symbol: "X",
                    },
                  ],
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Nico",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "generate",
                card: "Icebound Slam",
                player: "controller",
                destination: {
                  zone: "memory",
                },
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: {
                  named: "lash",
                },
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default sablemereWardensGrip;
