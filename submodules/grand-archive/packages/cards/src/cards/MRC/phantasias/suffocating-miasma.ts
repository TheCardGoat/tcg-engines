import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const suffocatingMiasma: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "coxpnjvt9y",
  slug: "suffocating-miasma",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "coxpnjvt9y:face:default",
      catalogId: "coxpnjvt9y",
      name: "Suffocating Miasma",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "Imbue 2\n\nOn Enter: If Suffocating Miasma is imbued, you may put three debuff counters on target ally.\n\nAt the beginning of each opponent’s recollection phase, that player puts a debuff counter on an ally they control. If they don’t, deal 2 unpreventable damage to their champion.",
      abilities: [
        {
          id: "coxpnjvt9y-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "coxpnjvt9y-a2",
          kind: "triggered",
          text: "On Enter: If Suffocating Miasma is imbued, you may put three debuff counters on target ally.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "debuff",
                amount: 3,
              },
            },
          },
        },
        {
          id: "coxpnjvt9y-a3",
          kind: "triggered",
          text: "At the beginning of each opponent’s recollection phase, that player puts a debuff counter on an ally they control. If they don’t, deal 2 unpreventable damage to their champion.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "opponent",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                bindSucceededAs: "counter-placement-succeeded",
                effect: {
                  kind: "choose",
                  selection: {
                    id: "event-player-ally",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "event-actor",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
                      player: "event-actor",
                      filter: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  effect: {
                    kind: "add-counter",
                    subject: {
                      kind: "bound",
                      binding: "event-player-ally",
                    },
                    counter: "debuff",
                    amount: 1,
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "counter-placement-succeeded",
                },
                then: {
                  kind: "no-op",
                },
                else: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "champion",
                    player: "event-actor",
                  },
                  amount: 2,
                  preventable: false,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default suffocatingMiasma;
