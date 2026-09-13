import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const innervateAgility: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v43ehjdu50",
  slug: "innervate-agility",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v43ehjdu50:face:default",
      catalogId: "v43ehjdu50",
      name: "Innervate Agility",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, delevel your champion and recover 5. (To delevel your champion, return the top card of its lineage to its owner's material deck.)\n\nUnits you control gain your choice of stealth or spellshroud until end of turn.",
      abilities: [
        {
          id: "v43ehjdu50-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, delevel your champion and recover 5. (To delevel your champion, return the top card of its lineage to its owner's material deck.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "all",
                costs: [
                  {
                    kind: "delevel-champion",
                  },
                  {
                    kind: "recover",
                    amount: 5,
                    requiresExact: true,
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "v43ehjdu50-a2",
          kind: "card-resolution",
          text: "Units you control gain your choice of stealth or spellshroud until end of turn.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "choice-1",
                text: "stealth",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
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
              },
              {
                id: "choice-2",
                text: "spellshroud",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                    },
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "spellshroud",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default innervateAgility;
