import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/channel-galcia-s-cradle.generated.ts";

export const channelGalciaSCradle = definePitchFamily(fabPitchFamilies["channel-galcia-s-cradle"], {
  abilities: () => ({
    whenEntersArenaAtStartTurnFreezeTargetAlly: {
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
          type: "freeze",
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["permanent"],
            filter: {
              or: [
                {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Item"],
                  },
                },
                {
                  typeBox: {
                    types: ["Equipment"],
                  },
                },
              ],
            },
            count: 1,
          },
          duration: "while-in-arena",
        },
      },
      label: {
        name: "freeze",
      },
    },
    whenEntersArenaAtStartTurnFreezeTargetAlly2: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
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
          type: "freeze",
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["permanent"],
            filter: {
              or: [
                {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Item"],
                  },
                },
                {
                  typeBox: {
                    types: ["Equipment"],
                  },
                },
              ],
            },
            count: 1,
          },
          duration: "while-in-arena",
        },
      },
      label: {
        name: "freeze",
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
});
export const { blue: channelGalciaSCradleBlue } = channelGalciaSCradle.cards;
