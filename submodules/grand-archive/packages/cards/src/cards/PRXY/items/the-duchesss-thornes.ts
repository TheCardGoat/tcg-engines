import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const theDuchesssThornes: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bEXmm4rKOs",
  slug: "the-duchesss-thornes",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bEXmm4rKOs:face:default",
      catalogId: "bEXmm4rKOs",
      name: "The Duchess's Thornes",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SUITED", "ACCESSORY"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Hindered\n\nWhenever you activate a cardistry ability of an ally, that ally gets +1POWER and gains true sight until end of turn.\n\nREST, Banish The Duchess's Thornes: The next cardistry ability you activate this turn costs (6) less to activate.",
      abilities: [
        {
          id: "bEXmm4rKOs-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "bEXmm4rKOs-a2",
          kind: "triggered",
          text: "Whenever you activate a cardistry ability of an ally, that ally gets +1POWER and gains true sight until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "event-subject",
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
                  amount: 1,
                },
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "event-subject",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "true-sight",
                  },
                },
              },
            ],
          },
        },
        {
          id: "bEXmm4rKOs-a3",
          kind: "activated",
          text: "REST, Banish The Duchess's Thornes: The next cardistry ability you activate this turn costs (6) less to activate.",
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
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            activationKind: "ability",
            abilityFilter: {
              keyword: "cardistry",
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 6,
            duration: {
              kind: "for-next-event",
              event: "ability-activated",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default theDuchesssThornes;
