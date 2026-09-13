import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flourishingQi: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MDu0e3tib8",
  slug: "flourishing-qi",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MDu0e3tib8:face:default",
      catalogId: "MDu0e3tib8",
      name: "Flourishing Qi",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      speed: "slow",
      stats: {},
      rulesText:
        "Whenever your Shifting Currents change from facing any direction to North while this card's activation is on the effects stack, put four charge counters on that activation.\n\nDeal LV+X damage to target unit, where X is the amount of charge counters on this card's activation.",
      abilities: [
        {
          id: "MDu0e3tib8-a1",
          kind: "triggered",
          text: "Whenever your Shifting Currents change from facing any direction to North while this card's activation is on the effects stack, put four charge counters on that activation.",
          trigger: {
            kind: "event",
            event: {
              name: "player-state-changed",
              actor: "controller",
              state: "shifting-currents",
              directionTransition: {
                to: "north",
              },
              condition: {
                kind: "source-activation-zone",
                zone: "effects-stack",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "source-activation-zone",
              zone: "effects-stack",
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "source",
              },
              counter: {
                named: "charge",
              },
              amount: 4,
            },
          },
        },
        {
          id: "MDu0e3tib8-a2",
          kind: "card-resolution",
          text: "Deal LV+X damage to target unit, where X is the amount of charge counters on this card's activation.",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                {
                  kind: "property",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  property: "level",
                  basis: "current",
                },
                {
                  kind: "counter-count",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "charge",
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

export default flourishingQi;
