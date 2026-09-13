import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/channel-the-millennium-tree.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const channelTheMillenniumTree = definePitchFamily(
  fabPitchFamilies["channel-the-millennium-tree"],
  {
    keywords: [
      goAgain,
      {
        name: "amp",
        value: 3,
      },
    ],
    abilities: () => ({
      whenEntersArenaAtBeginningActionPhaseAmp3: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
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
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "amp",
            amount: 3,
          },
        },
      },
      whenEntersArenaAtBeginningActionPhaseAmp32: {
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
            type: "amp",
            amount: 3,
          },
        },
      },
      atBeginningEndPhasePutFlowCounterThenDestroy: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "end-phase",
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
                type: "add-counter",
                counter: {
                  kind: "named",
                  name: "flow",
                },
                count: 1,
                target: {
                  selector: "self",
                },
              },
              {
                type: "unless",
                effect: {
                  type: "destroy",
                  target: {
                    selector: "self",
                  },
                },
                escape: {
                  type: "move-card",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["pitch"],
                    filter: {
                      typeBox: {
                        supertypes: ["Earth"],
                      },
                    },
                    count: {
                      type: "count",
                      what: "counters-on-source",
                    },
                  },
                  to: {
                    zone: "deck",
                    position: "bottom",
                  },
                },
              },
            ],
          },
        },
        label: {
          name: "channel-earth",
        },
      },
    }),
  },
);
export const { red: channelTheMillenniumTreeRed } = channelTheMillenniumTree.cards;
