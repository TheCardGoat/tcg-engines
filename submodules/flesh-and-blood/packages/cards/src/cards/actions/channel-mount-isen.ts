import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/channel-mount-isen.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const channelMountIsen = definePitchFamily(fabPitchFamilies["channel-mount-isen"], {
  keywords: [goAgain],
  abilities: () => ({
    atStartEachHeroSTurnTheyLoseEqual: {
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
          type: "lose-life",
          amount: {
            type: "count",
            what: "cards-in-zone",
            zone: "permanent",
            filter: {
              name: "Frostbite",
            },
          },
          target: {
            selector: "each-hero",
          },
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
export const { blue: channelMountIsenBlue } = channelMountIsen.cards;
