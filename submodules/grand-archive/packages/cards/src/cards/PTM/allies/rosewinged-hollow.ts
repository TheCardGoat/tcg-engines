import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rosewingedHollow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6S1LLrBfBU",
  slug: "rosewinged-hollow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6S1LLrBfBU:face:default",
      catalogId: "6S1LLrBfBU",
      name: "Rosewinged Hollow",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPECTER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Alice Bonus] [Element Bonus] (2), Banish this card from your graveyard: Put a haunt counter on your Phantasmagoria. Then if there are six or more haunt counters on it, choose a Specter ally you control and it gets +2POWER until end of turn. (Activate this ability only if your champion’s element matches this card’s element.)",
      abilities: [
        {
          id: "6S1LLrBfBU-a1",
          kind: "activated",
          text: "[Alice Bonus] [Element Bonus] (2), Banish this card from your graveyard: Put a haunt counter on your Phantasmagoria. Then if there are six or more haunt counters on it, choose a Specter ally you control and it gets +2POWER until end of turn. (Activate this ability only if your champion’s element matches this card’s element.)",
          activation: "ability",
          functionalZones: ["graveyard"],
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
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
                name: "Alice",
              },
            },
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "mastery",
                  player: "controller",
                  name: "Phantasmagoria",
                },
                counter: {
                  named: "haunt",
                },
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "has-counter",
                  subject: {
                    kind: "mastery",
                    player: "controller",
                    name: "Phantasmagoria",
                  },
                  counter: {
                    named: "haunt",
                  },
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "mastery",
                        player: "controller",
                        name: "Phantasmagoria",
                      },
                      counter: {
                        named: "haunt",
                      },
                    },
                    operator: "gte",
                    right: 6,
                  },
                },
                then: {
                  kind: "choose",
                  selection: {
                    id: "chosen-specter",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
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
                  effect: {
                    kind: "continuous",
                    subjects: {
                      kind: "bound",
                      binding: "chosen-specter",
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
                      amount: 2,
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

export default rosewingedHollow;
