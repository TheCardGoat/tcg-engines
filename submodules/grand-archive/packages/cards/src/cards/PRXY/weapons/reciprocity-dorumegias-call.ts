import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reciprocityDorumegiasCall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mSOHJGjrIu",
  slug: "reciprocity-dorumegias-call",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mSOHJGjrIu:face:default",
      catalogId: "mSOHJGjrIu",
      name: "Reciprocity, Dorumegia's Call",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Tonoris Bonus] You may pay (6) to activate this card from your material deck. It costs (3) less to activate this way for each non-token domain you control.\n\n[Tonoris Bonus] [Level 2+] REST: Negate up to one target upkeep trigger. Then summon an Automaton Drone token.",
      abilities: [
        {
          id: "mSOHJGjrIu-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Tonoris Bonus] You may pay (6) to activate this card from your material deck. It costs (3) less to activate this way for each non-token domain you control.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tonoris",
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
              cost: {
                kind: "pay-reserve",
                amount: 6,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              costKind: "reserve",
              costOperation: "subtract",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  3,
                  {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["DOMAIN"],
                          },
                          {
                            kind: "token",
                            value: false,
                          },
                        ],
                      },
                    },
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "mSOHJGjrIu-a2",
          kind: "activated",
          text: "[Tonoris Bonus] [Level 2+] REST: Negate up to one target upkeep trigger. Then summon an Automaton Drone token.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["ability"],
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tonoris",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "negate",
                subject: {
                  kind: "bound",
                  binding: "target-stack-item",
                },
                bindResultAs: "negated-stack-item",
              },
              {
                kind: "summon",
                object: "Automaton Drone",
                controller: "controller",
                bindResultAs: "summoned-token",
              },
            ],
          },
        },
      ],
    },
  },
};

export default reciprocityDorumegiasCall;
