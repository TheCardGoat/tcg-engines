import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/channel-the-bleak-expanse.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const channelTheBleakExpanse = definePitchFamily(
  fabPitchFamilies["channel-the-bleak-expanse"],
  {
    keywords: [goAgain],
    abilities: () => ({
      heroesCanTRevealSearchDecksDrawFromEffects: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "rule-modification",
              mode: "restrict",
              action: "reveal",
              subject: {
                typeBox: {
                  types: ["Hero"],
                },
                hasStatus: "from-effects",
              },
              duration: "while-in-arena",
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "search",
              subject: {
                typeBox: {
                  types: ["Hero"],
                },
                hasStatus: "from-effects",
              },
              duration: "while-in-arena",
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "draw",
              subject: {
                typeBox: {
                  types: ["Hero"],
                },
                hasStatus: "from-effects",
              },
              duration: "while-in-arena",
            },
          ],
        },
      },
      atBeginningEndPhasePutFlowCounterChannelBleak: {
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
                        supertypes: ["Ice"],
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
          name: "channel-ice",
        },
      },
    }),
  },
);
export const { blue: channelTheBleakExpanseBlue } = channelTheBleakExpanse.cards;
