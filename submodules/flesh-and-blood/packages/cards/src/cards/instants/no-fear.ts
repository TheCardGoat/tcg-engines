import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/no-fear.generated.ts";

export const noFear = definePitchFamily(fabPitchFamilies["no-fear"], {
  abilities: () => ({
    asAdditionalCostPlayBanishAnyNumber6More: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: {
            type: "any-number",
          },
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
          outputBinding: "them",
        },
        then: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "end-phase",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "move-card",
              target: {
                selector: "binding",
                binding: "them",
              },
              to: {
                zone: "hand",
              },
            },
          },
        },
      },
    },
    nextTimeWouldBeDealtDamageTurnPreventX: {
      kind: "resolution",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: {
          type: "sum",
          operands: [
            2,
            {
              type: "count",
              what: "banished-to-play-this",
            },
          ],
        },
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: noFearRed } = noFear.cards;
