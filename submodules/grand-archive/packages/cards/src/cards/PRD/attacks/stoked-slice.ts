import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stokedSlice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6wiHKD52Lw",
  slug: "stoked-slice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6wiHKD52Lw:face:default",
      catalogId: "6wiHKD52Lw",
      name: "Stoked Slice",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] On Attack: You may banish two fire element cards from your graveyard. If you do, allies you control get +1POWER until end of turn. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "6wiHKD52Lw-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may banish two fire element cards from your graveyard. If you do, allies you control get +1POWER until end of turn. (Apply this effect only if your champion's class matches this card's class.)",
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
                  kind: "attempt",
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 2,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
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
              ],
            },
          },
        },
      ],
    },
  },
};

export default stokedSlice;
