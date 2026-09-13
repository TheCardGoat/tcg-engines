import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const polarisTwinklingCauldron: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "41t71u4bzz",
  slug: "polaris-twinkling-cauldron",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "41t71u4bzz:face:default",
      catalogId: "41t71u4bzz",
      name: "Polaris, Twinkling Cauldron",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Arisanna Bonus] You may activate this card from your material deck. If you do, Polaris enters the field rested.\n\nWhenever you sacrifice an Herb, put an age counter on Polaris.\n\n[Class Bonus] REST, Banish Polaris: Deal X damage to all allies. Then generate up to X Cosmic Bolt cards and shuffle them into your deck. X is the amount of age counters that were on Polaris. ",
      abilities: [
        {
          id: "41t71u4bzz-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Arisanna Bonus] You may activate this card from your material deck. If you do, Polaris enters the field rested.",
          functionalZones: ["material-deck"],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              activationResult: {
                entryState: {
                  state: "rested",
                  value: true,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "41t71u4bzz-a2",
          kind: "triggered",
          text: "Whenever you sacrifice an Herb, put an age counter on Polaris.",
          trigger: {
            kind: "event",
            event: {
              name: "object-sacrificed",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["HERB"],
                },
              },
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
          id: "41t71u4bzz-a3",
          kind: "activated",
          text: "[Class Bonus] REST, Banish Polaris: Deal X damage to all allies. Then generate up to X Cosmic Bolt cards and shuffle them into your deck. X is the amount of age counters that were on Polaris.",
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
            {
              symbol: "Y",
              kind: "chosen",
              minimum: 0,
              maximum: {
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
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
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
              {
                kind: "generate",
                card: "Cosmic Bolt",
                player: "controller",
                destination: {
                  zone: "main-deck",
                },
                amount: {
                  kind: "variable",
                  symbol: "Y",
                },
              },
              {
                kind: "shuffle",
                player: "controller",
                zone: "main-deck",
              },
            ],
          },
        },
      ],
    },
  },
};

export default polarisTwinklingCauldron;
