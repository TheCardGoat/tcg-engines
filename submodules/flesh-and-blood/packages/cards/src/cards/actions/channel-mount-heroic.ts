import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/channel-mount-heroic.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const channelMountHeroic = definePitchFamily(fabPitchFamilies["channel-mount-heroic"], {
  keywords: [goAgain],
  abilities: () => ({
    attackActionControlHave3: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent", "combat-chain"],
          filter: attackActionFilter(),
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    atBeginningEndPhasePutFlowCounterChannelMount: {
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
});
export const { red: channelMountHeroicRed } = channelMountHeroic.cards;
