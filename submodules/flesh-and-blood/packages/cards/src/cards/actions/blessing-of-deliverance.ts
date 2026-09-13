import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-deliverance.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const blessingOfDeliverance = definePitchFamily(
  fabPitchFamilies["blessing-of-deliverance"],
  {
    parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
    keywords: [goAgain],
    abilities: (amount) => ({
      staticTriggeredEnterArenaEnterArenaDraw: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "enter-arena",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "source",
              selector: "moved-object",
            },
          },
          state: {
            type: "zone-count",
            zone: "pitch",
            player: "controller",
            filter: {
              numeric: [
                {
                  property: "cost",
                  basis: "base",
                  comparison: { op: "gte", value: 3 },
                },
              ],
            },
            comparison: {
              op: "gte",
              value: 1,
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "draw",
            count: 1,
            player: "controller",
          },
        },
      },
      staticTriggeredActionPhaseStartActionPhaseStartSequence: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "action-phase-start",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
              {
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["deck"],
                  position: "top",
                  count: amount,
                },
              },
              {
                type: "gain-life",
                amount: {
                  type: "count",
                  what: "revealed-this-way",
                  filter: {
                    cost: {
                      op: "gte",
                      value: 3,
                    },
                  },
                },
                target: {
                  selector: "controller",
                },
              },
            ],
          },
        },
      },
    }),
  },
);

export const {
  red: blessingOfDeliveranceRed,
  yellow: blessingOfDeliveranceYellow,
  blue: blessingOfDeliveranceBlue,
} = blessingOfDeliverance.cards;
