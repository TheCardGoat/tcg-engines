import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stellarCosmos: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jaiTSvaLOQ",
  slug: "stellar-cosmos",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jaiTSvaLOQ:face:default",
      catalogId: "jaiTSvaLOQ",
      name: "Stellar Cosmos",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERWING"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        '[Class Bonus] Spellshroud\n\n[Diana Bonus] On Charge 3: Stellar Cosmos gains "Aethercharge cards you look at while glimpsing have aethercalling."',
      abilities: [
        {
          id: "jaiTSvaLOQ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Spellshroud",
          keyword: {
            name: "spellshroud",
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
        {
          id: "jaiTSvaLOQ-a2",
          kind: "triggered",
          text: '[Diana Bonus] On Charge 3: Stellar Cosmos gains "Aethercharge cards you look at while glimpsing have aethercalling."',
          label: {
            name: "On Charge",
            parameters: {
              threshold: 3,
            },
          },
          trigger: {
            kind: "event",
            event: {
              name: "counter-added",
              subject: {
                kind: "source",
              },
              counter: {
                named: "charge",
              },
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          interveningCondition: {
            kind: "has-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "charge",
            },
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "charge",
                },
              },
              operator: "gte",
              right: 3,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "permanent",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-pzrfs0-a1",
                kind: "static",
                staticKind: "effects",
                text: "Aethercharge cards you look at while glimpsing have aethercalling.",
                effects: [
                  {
                    kind: "rule-modification",
                    mode: "grant-keyword",
                    action: "glimpse",
                    subject: {
                      kind: "player",
                      player: "controller",
                    },
                    filter: {
                      kind: "subtype",
                      oneOf: ["AETHERCHARGE"],
                    },
                    grantedKeyword: {
                      name: "aethercalling",
                    },
                    duration: {
                      kind: "while-source-in-functional-zone",
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default stellarCosmos;
