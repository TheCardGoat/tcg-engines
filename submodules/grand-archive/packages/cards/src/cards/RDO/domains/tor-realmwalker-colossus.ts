import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const torRealmwalkerColossus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YKrCbNs3rh",
  slug: "tor-realmwalker-colossus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YKrCbNs3rh:face:default",
      catalogId: "YKrCbNs3rh",
      name: "Tor, Realmwalker Colossus",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SIEGEABLE", "CONSTRUCT", "GOLEM"],
      },
      elements: ["NEOS"],
      stats: {
        power: 0,
        durability: 4,
      },
      rulesText:
        "Tor can attack as though it were an ally.\n\nTor gets +1POWER for every four durability counters on it.\n\n[Class Bonus] On Enter: Sacrifice up to three domains. For each domain sacrificed this way, put 2+X durability counters on Tor where X is that domain's reserve cost.\n\n",
      abilities: [
        {
          id: "YKrCbNs3rh-a1",
          kind: "static",
          staticKind: "effects",
          text: "Tor can attack as though it were an ally.",
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "attack-as-ally",
              subject: {
                kind: "source",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "YKrCbNs3rh-a2",
          kind: "static",
          staticKind: "effects",
          text: "Tor gets +1POWER for every four durability counters on it.",
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
                amount: {
                  kind: "calculate",
                  operator: "divide",
                  operands: [
                    {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: "durability",
                    },
                    4,
                  ],
                  rounding: "down",
                },
              },
            },
          ],
        },
        {
          id: "YKrCbNs3rh-a3",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Sacrifice up to three domains. For each domain sacrificed this way, put 2+X durability counters on Tor where X is that domain's reserve cost.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "sacrificed-domain",
                },
                property: "reserve-cost",
                basis: "last-known",
                missing: "zero",
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
                kind: "choose",
                selection: {
                  id: "sacrificed-domains",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 3,
                  },
                  candidates: {
                    kind: "object",
                    zones: ["field"],
                    relationship: "controlled-by",
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["DOMAIN"],
                    },
                  },
                },
                effect: {
                  kind: "sacrifice",
                  subject: {
                    kind: "bound",
                    binding: "sacrificed-domains",
                  },
                  bindResultAs: "sacrificed-domains",
                },
              },
              {
                kind: "for-each",
                collection: {
                  binding: "sacrificed-domains",
                },
                bindEachAs: "sacrificed-domain",
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "durability",
                  amount: {
                    kind: "calculate",
                    operator: "add",
                    operands: [
                      2,
                      {
                        kind: "property",
                        subject: {
                          kind: "bound",
                          binding: "sacrificed-domain",
                        },
                        property: "reserve-cost",
                        basis: "last-known",
                        missing: "zero",
                      },
                    ],
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

export default torRealmwalkerColossus;
