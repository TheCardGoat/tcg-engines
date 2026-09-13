import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/channel-thunder-steppe.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const channelThunderSteppe = definePitchFamily(fabPitchFamilies["channel-thunder-steppe"], {
  keywords: [goAgain],
  abilities: () => ({
    wheneverPlayActionMayPayIfDoGainsGo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                types: ["Action"],
              },
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "controller",
          },
          then: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        },
      },
    },
    atBeginningEndPhasePutFlowCounterChannelThunder: {
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
                      supertypes: ["Lightning"],
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
        name: "channel-lightning",
      },
    },
  }),
});
export const { yellow: channelThunderSteppeYellow } = channelThunderSteppe.cards;
