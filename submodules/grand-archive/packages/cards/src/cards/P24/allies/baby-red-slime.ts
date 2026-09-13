import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const babyRedSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "r7oifozaog",
  slug: "baby-red-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "r7oifozaog:face:default",
      catalogId: "r7oifozaog",
      name: "Baby Red Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SLIME"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Attack: You may discard a card. If you do, draw a card into your memory. If the discarded card was a fire element card, Baby Red Slime gets +1 POWER until end of turn. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "r7oifozaog-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may discard a card. If you do, draw a card into your memory. If the discarded card was a fire element card, Baby Red Slime gets +1 POWER until end of turn. (Apply this effect only if your champion’s class matches this card’s class.)",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "discard",
                  player: "controller",
                  selection: {
                    id: "discarded-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                  bindResultAs: "discarded-card",
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "collection-exists",
                    collection: {
                      binding: "discarded-card",
                      filter: {
                        kind: "element",
                        oneOf: ["FIRE"],
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
              ],
            },
          },
        },
      ],
    },
  },
};

export default babyRedSlime;
