import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beguilingCoup: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "q1b6htzcox",
  slug: "beguiling-coup",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "q1b6htzcox:face:default",
      catalogId: "q1b6htzcox",
      name: "Beguiling Coup",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] (2), Banish Beguiling Coup and put an omen counter on it: Put another target attack omen into the attacker's intent. Trigger each of that card's on attack abilities. You may choose a new target for this attack. \n\n[Element Bonus] As long as this card is one of your omens and you have no other reserve cost 1 omens, your champion's attacks get +1POWER.",
      abilities: [
        {
          id: "q1b6htzcox-a1",
          kind: "activated",
          text: "[Class Bonus] (2), Banish Beguiling Coup and put an omen counter on it: Put another target attack omen into the attacker's intent. Trigger each of that card's on attack abilities. You may choose a new target for this attack.",
          activation: "ability",
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
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "omen",
                amount: 1,
              },
            ],
          },
          targets: [
            {
              id: "target-attack-omen",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["banishment"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ATTACK"],
                    },
                    {
                      kind: "has-counter",
                      counter: "omen",
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          ],
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
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-attack-omen",
                },
                destination: {
                  zone: "intent",
                  host: {
                    kind: "related",
                    subject: {
                      kind: "current-attack",
                    },
                    relation: "attacker",
                  },
                },
              },
              {
                kind: "trigger-abilities",
                subject: {
                  kind: "bound",
                  binding: "target-attack-omen",
                },
                triggerName: "on-attack",
                count: "each",
              },
              {
                kind: "optional",
                player: "controller",
                effect: {
                  kind: "retarget",
                  subject: {
                    kind: "current-attack",
                  },
                  chooser: "controller",
                },
                allOrNothing: true,
              },
            ],
          },
        },
        {
          id: "q1b6htzcox-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Element Bonus] As long as this card is one of your omens and you have no other reserve cost 1 omens, your champion's attacks get +1POWER.",
          functionalZones: ["banishment"],
          restrictions: [
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "attacks-by",
                attacker: {
                  kind: "champion",
                  player: "controller",
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "source-zone",
                    zone: "banishment",
                  },
                  {
                    kind: "has-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: "omen",
                  },
                  {
                    kind: "player-zone-count",
                    players: "controller",
                    quantifier: "all",
                    zone: "banishment",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "all",
                          filters: [
                            {
                              kind: "has-counter",
                              counter: "omen",
                            },
                            {
                              kind: "numeric",
                              comparison: {
                                left: {
                                  kind: "property",
                                  subject: {
                                    kind: "candidate",
                                  },
                                  property: "reserve-cost",
                                  basis: "base",
                                },
                                operator: "eq",
                                right: 1,
                              },
                            },
                          ],
                        },
                        {
                          kind: "not-source",
                        },
                      ],
                    },
                    operator: "eq",
                    value: 0,
                  },
                ],
              },
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default beguilingCoup;
