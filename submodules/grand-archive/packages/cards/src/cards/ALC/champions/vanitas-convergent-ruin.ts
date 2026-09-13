import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vanitasConvergentRuin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8m69iq4d5v",
  slug: "vanitas-convergent-ruin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8m69iq4d5v:face:default",
      catalogId: "8m69iq4d5v",
      name: "Vanitas, Convergent Ruin",
      lineageName: "Vanitas",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        level: 2,
        power: 1,
        life: 22,
      },
      rulesText:
        "Vanitas Lineage\n\nWhenever you activate a Spell card, Vanitas' next attack without a weapon this turn gets +1 POWER.\n\nOn Champion Hit: If 7 or more damage was dealt, cards that opponent materializes cost 1 more to materialize until the beginning of your next turn. ",
      abilities: [
        {
          id: "8m69iq4d5v-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Vanitas Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Vanitas",
          },
        },
        {
          id: "8m69iq4d5v-a2",
          kind: "triggered",
          text: "Whenever you activate a Spell card, Vanitas' next attack without a weapon this turn gets +1 POWER.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              },
            },
          },
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "source",
                },
                usingAbsent: {
                  kind: "event-object",
                  filter: {
                    kind: "type",
                    oneOf: ["WEAPON"],
                  },
                },
              },
            },
            effect: {
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
                amount: 1,
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "8m69iq4d5v-a3",
          kind: "triggered",
          text: "On Champion Hit: If 7 or more damage was dealt, cards that opponent materializes cost 1 more to materialize until the beginning of your next turn.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "compare",
              comparison: {
                left: {
                  kind: "event-amount",
                },
                operator: "gte",
                right: 7,
              },
            },
            then: {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "materialize",
              subject: {
                kind: "player",
                player: "event-recipient-controller",
              },
              costKind: "memory",
              costOperation: "add",
              amount: 1,
              duration: {
                kind: "until-start-of-turn",
                whose: "controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default vanitasConvergentRuin;
