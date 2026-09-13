import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const corhaziLightblade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2Ch1Gp3jEL",
  slug: "corhazi-lightblade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2Ch1Gp3jEL:face:default",
      catalogId: "2Ch1Gp3jEL",
      name: "Corhazi Lightblade",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Attack: Reveal a card from your memory at random. If a luxem element card was revealed, Corhazi Lightblade gains critical 1 until end of turn. (If combat damage would be dealt by a source with critical 1, double that damage unless an opponent discards a card.)",
      abilities: [
        {
          id: "2Ch1Gp3jEL-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Reveal a card from your memory at random. If a luxem element card was revealed, Corhazi Lightblade gains critical 1 until end of turn. (If combat damage would be dealt by a source with critical 1, double that damage unless an opponent discards a card.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                  method: "random",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    binding: "revealed-card",
                    filter: {
                      kind: "element",
                      oneOf: ["LUXEM"],
                    },
                  },
                },
                then: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
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
                      name: "critical",
                      value: 1,
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

export default corhaziLightblade;
