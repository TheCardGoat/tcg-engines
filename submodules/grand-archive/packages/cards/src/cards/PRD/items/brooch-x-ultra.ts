import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const broochXUltra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3Gx9ByIl9t",
  slug: "brooch-x-ultra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3Gx9ByIl9t:face:default",
      catalogId: "3Gx9ByIl9t",
      name: "Brooch X Ultra",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "ACCESSORY"],
      },
      elements: ["ARCANE"],
      stats: {},
      rulesText:
        'Ally Link\n\nLinked ally gets +2POWER and has "On Attack: Banish a card at random from your memory. If you do, draw a card."',
      abilities: [
        {
          id: "3Gx9ByIl9t-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "3Gx9ByIl9t-a2",
          kind: "static",
          staticKind: "effects",
          text: 'Linked ally gets +2POWER and has "On Attack: Banish a card at random from your memory. If you do, draw a card."',
          executionSource: "linked-object",
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
                amount: 2,
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-1kv7u18-a1",
                  kind: "triggered",
                  text: "On Attack: Banish a card at random from your memory. If you do, draw a card.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "attack-declared",
                      subject: {
                        kind: "source",
                      },
                    },
                  },
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
                        bindSucceededAs: "prior-effect-succeeded",
                      },
                      {
                        kind: "conditional",
                        condition: {
                          kind: "effect-succeeded",
                          binding: "prior-effect-succeeded",
                        },
                        then: {
                          kind: "draw",
                          player: "controller",
                          amount: 1,
                        },
                      },
                    ],
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

export default broochXUltra;
