import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/channel-lake-frigid.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): opposing cards (hand/stack) and activations cost +1{r} while this is in arena. */
export const channelLakeFrigid = definePitchFamily(fabPitchFamilies["channel-lake-frigid"], {
  keywords: [goAgain],
  abilities: () => ({
    activatedAbilitiesCostOpposingHeroesAdditional: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "cost",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["hand", "stack"],
              count: {
                type: "all",
              },
            },
            duration: "while-in-arena",
          },
          {
            type: "modify-activation-cost",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              count: {
                type: "all",
              },
            },
            duration: "while-in-arena",
          },
        ],
      },
    },
    atBeginningEndPhasePutFlowCounterChannelLake: {
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
export const { blue: channelLakeFrigidBlue } = channelLakeFrigid.cards;
