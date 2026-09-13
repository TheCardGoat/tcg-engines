import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vengefulGust: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "q4dvnn3zp1",
  slug: "vengeful-gust",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "q4dvnn3zp1:face:default",
      catalogId: "q4dvnn3zp1",
      name: "Vengeful Gust",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Suppress target ally you don't control. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase.)\n\n[Level 3+] The next time that card would enter the field this turn, it enters with \"On Enter: Deal 4 damage to your champion.\"",
      abilities: [
        {
          id: "q4dvnn3zp1-a1",
          kind: "card-resolution",
          text: "Suppress target ally you don't control. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase.)",
          targets: [
            {
              id: "target-1",
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
                relationship: "controlled-by",
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "suppress",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
        {
          id: "q4dvnn3zp1-a2",
          kind: "ability-modifier",
          text: '[Level 3+] The next time that card would enter the field this turn, it enters with "On Enter: Deal 4 damage to your champion."',
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          restrictions: [
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
                  right: 3,
                },
              },
            },
          ],
          operation: {
            kind: "append-effect",
            effect: {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "bound-object",
                  binding: "target-1",
                },
              },
              limit: {
                count: 1,
                per: "object",
              },
              operation: {
                kind: "modify-characteristic",
                change: {
                  kind: "grant-ability",
                  ability: {
                    id: "granted-6qnj-a1",
                    kind: "triggered",
                    text: "On Enter: Deal 4 damage to your champion.",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "object-entered-field",
                        subject: {
                          kind: "ability-bearer",
                        },
                      },
                    },
                    effect: {
                      kind: "deal-damage",
                      source: {
                        kind: "ability-bearer",
                      },
                      recipient: {
                        kind: "champion",
                        player: "controller",
                      },
                      amount: 4,
                    },
                  },
                },
              },
              duration: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default vengefulGust;
