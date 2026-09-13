import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jinzhuoBandsOfVirtue: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m4MTDKWvyR",
  slug: "jinzhuo-bands-of-virtue",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m4MTDKWvyR:face:default",
      catalogId: "m4MTDKWvyR",
      name: "Jinzhuo, Bands of Virtue",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "[Guo Jia Bonus] REST, Banish Jinzhuo: Scavenge 6 for a Beast ally card. If a card was scavenged this way, put X quest counters on your champion, where X is that card's power stat. X is capped at 4. Otherwise, return Jinzhuo to the field rested. Activate this ability only if you control an object named Fabled Emerald Fatestone.\n",
      abilities: [
        {
          id: "m4MTDKWvyR-a1",
          kind: "activated",
          text: "[Guo Jia Bonus] REST, Banish Jinzhuo: Scavenge 6 for a Beast ally card. If a card was scavenged this way, put X quest counters on your champion, where X is that card's power stat. X is capped at 4. Otherwise, return Jinzhuo to the field rested. Activate this ability only if you control an object named Fabled Emerald Fatestone.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
          condition: {
            kind: "controls",
            player: "controller",
            filter: {
              kind: "name",
              value: "Fabled Emerald Fatestone",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "minimum",
                operands: [
                  4,
                  {
                    kind: "property",
                    subject: {
                      kind: "bound",
                      binding: "scavenged-beast",
                    },
                    property: "power",
                    basis: "base",
                    missing: "zero",
                  },
                ],
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "scavenge",
                player: "controller",
                amount: 6,
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["BEAST"],
                    },
                  ],
                },
                bindResultAs: "scavenged-beast",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "collection-exists",
                  collection: {
                    binding: "scavenged-beast",
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: {
                    named: "quest",
                  },
                  amount: {
                    kind: "calculate",
                    operator: "minimum",
                    operands: [
                      4,
                      {
                        kind: "property",
                        subject: {
                          kind: "bound",
                          binding: "scavenged-beast",
                        },
                        property: "power",
                        basis: "base",
                        missing: "zero",
                      },
                    ],
                  },
                },
                else: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "source",
                      },
                      from: "banishment",
                      destination: {
                        zone: "field",
                      },
                    },
                    {
                      kind: "set-object-state",
                      subject: {
                        kind: "source",
                      },
                      state: "rested",
                      value: true,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default jinzhuoBandsOfVirtue;
