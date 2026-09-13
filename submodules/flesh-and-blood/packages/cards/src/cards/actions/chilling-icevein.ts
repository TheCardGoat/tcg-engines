import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chilling-icevein.generated.ts";

export const chillingIcevein = definePitchFamily(fabPitchFamilies["chilling-icevein"], {
  parameters: pitchMap({
    red: { value1: 5, value2: 1, value3: 1 },
    yellow: { value1: 5, value2: 1, value3: 1 },
    blue: { value1: 5, value2: 1, value3: 1 },
  }),
  keywords: [fusion("Ice")],
  abilities: ({ value1: _value1, value2, value3 }) => ({
    resolutionHasStatusFusedDelayedTriggerDealtDamageDealtDamage: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "dealt-damage",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "damage-source",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
            },
            target: {
              kind: "hero",
            },
          },
        },
        // W3-FIX4 (plan §value1 defect row): the printed window is multi-fire,
        // turn-scoped, and repeating ("whenever … this turn"). Shape per the golden
        // AIO004 heavy-industry-power-plant module: windowed + this-turn +
        // matching "every" (re-fires on each qualifying event, expires at
        // turn end).
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "unless",
            effect: {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hand"],
                count: value2,
              },
            },
            escape: {
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: value3,
              },
              payer: "opponent",
            },
          },
        },
      },
    },
  }),
});

export const {
  red: chillingIceveinRed,
  yellow: chillingIceveinYellow,
  blue: chillingIceveinBlue,
} = chillingIcevein.cards;
