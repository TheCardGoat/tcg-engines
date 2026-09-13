import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const suzakusCommand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5v598k3m1w",
  slug: "suzakus-command",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5v598k3m1w:face:default",
      catalogId: "5v598k3m1w",
      name: "Suzaku's Command",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target Beast ally's next attack this turn gains unblockable and gets +2 POWER. If that ally is a Shenju, that attack gets an additional +2 POWER and gains Combat damage dealt by this attack is unpreventable. (An attack with unblockable can't be intercepted and ignores taunt.)",
      abilities: [
        {
          id: "5v598k3m1w-a1",
          kind: "card-resolution",
          text: "Target Beast ally's next attack this turn gains unblockable and gets +2 POWER. If that ally is a Shenju, that attack gets an additional +2 POWER and gains Combat damage dealt by this attack is unpreventable. (An attack with unblockable can't be intercepted and ignores taunt.)",
          targets: [
            {
              id: "target-beast",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
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
              },
            },
          ],
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "bound-object",
                  binding: "target-beast",
                },
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "unblockable",
                    },
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
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
                  kind: "conditional",
                  condition: {
                    kind: "subject-matches",
                    subject: {
                      kind: "bound",
                      binding: "target-beast",
                    },
                    filter: {
                      kind: "subtype",
                      oneOf: ["SHENJU"],
                    },
                  },
                  then: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "continuous",
                        subjects: {
                          kind: "current-attack",
                        },
                        affectedSet: "locked",
                        duration: {
                          kind: "this-attack",
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
                        kind: "rule-modification",
                        mode: "forbid",
                        action: "prevent-damage",
                        subject: {
                          kind: "current-attack",
                        },
                        damageKind: "combat",
                        duration: {
                          kind: "this-attack",
                        },
                      },
                    ],
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

export default suzakusCommand;
