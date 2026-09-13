import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const distilledAtrophy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h38lrj5221",
  slug: "distilled-atrophy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h38lrj5221:face:default",
      catalogId: "h38lrj5221",
      name: "Distilled Atrophy",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Brew — One Blightroot, One Herb\n\nAt the beginning of your recollection phase, put an age counter on Distilled Atrophy.\n\nSacrifice Distilled Atrophy: Target champion gets -X level until end of turn. Then if that champion is level 0 or lower, deal X damage to them. X is the amount of age counters that were on Distilled Atrophy.",
      abilities: [
        {
          id: "h38lrj5221-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Blightroot, One Herb",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "name",
                value: "Blightroot",
                count: 1,
              },
              {
                kind: "subtype",
                value: "Herb",
                count: 1,
              },
            ],
          },
        },
        {
          id: "h38lrj5221-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, put an age counter on Distilled Atrophy.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "age",
            },
            amount: 1,
          },
        },
        {
          id: "h38lrj5221-a3",
          kind: "activated",
          text: "Sacrifice Distilled Atrophy: Target champion gets -X level until end of turn. Then if that champion is level 0 or lower, deal X damage to them. X is the amount of age counters that were on Distilled Atrophy.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-champion",
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
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "age",
                },
                basis: "last-known",
                missing: "zero",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-champion",
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
                  property: "level",
                  operation: "subtract",
                  amount: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "age",
                    },
                    basis: "last-known",
                    missing: "zero",
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "property",
                      subject: {
                        kind: "bound",
                        binding: "target-champion",
                      },
                      property: "level",
                      basis: "current",
                    },
                    operator: "lte",
                    right: 0,
                  },
                },
                then: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "bound",
                    binding: "target-champion",
                  },
                  amount: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "age",
                    },
                    basis: "last-known",
                    missing: "zero",
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

export default distilledAtrophy;
