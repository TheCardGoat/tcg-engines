import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dusklightCommunion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5upufyoz23",
  slug: "dusklight-communion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5upufyoz23:face:default",
      catalogId: "5upufyoz23",
      name: "Dusklight Communion",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        'As an additional cost to activate this card, banish an astra or umbra element card from your material deck. \n\nOn Enter: If the banished card was astra element, destroy up to one target phantasia. If the banished card was umbra element, Dusklight Communion gains "Champions get -1 level." ',
      abilities: [
        {
          id: "5upufyoz23-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, banish an astra or umbra element card from your material deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "material-deck",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "element",
                  oneOf: ["ASTRA", "UMBRA"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "5upufyoz23-a2",
          kind: "triggered",
          text: 'On Enter: If the banished card was astra element, destroy up to one target phantasia. If the banished card was umbra element, Dusklight Communion gains "Champions get -1 level."',
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-phantasia",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["PHANTASIA"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    zones: ["banishment"],
                    host: {
                      kind: "source",
                    },
                    relationship: "activation-payment-of",
                    filter: {
                      kind: "element",
                      oneOf: ["ASTRA"],
                    },
                  },
                },
                then: {
                  kind: "destroy",
                  subject: {
                    kind: "bound",
                    binding: "target-phantasia",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    zones: ["banishment"],
                    host: {
                      kind: "source",
                    },
                    relationship: "activation-payment-of",
                    filter: {
                      kind: "element",
                      oneOf: ["UMBRA"],
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
                    kind: "permanent",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-ability",
                    ability: {
                      id: "granted-194hxbh-a1",
                      kind: "static",
                      staticKind: "effects",
                      text: "Champions get -1 level.",
                      effects: [
                        {
                          kind: "continuous",
                          subjects: {
                            kind: "each",
                            collection: {
                              zones: ["field"],
                              filter: {
                                kind: "type",
                                oneOf: ["CHAMPION"],
                              },
                            },
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
                            property: "level",
                            operation: "subtract",
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
        },
      ],
    },
  },
};

export default dusklightCommunion;
