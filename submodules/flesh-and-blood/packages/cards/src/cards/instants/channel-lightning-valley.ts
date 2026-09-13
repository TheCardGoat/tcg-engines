import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/channel-lightning-valley.generated.ts";

export const channelLightningValley = definePitchFamily(
  fabPitchFamilies["channel-lightning-valley"],
  {
    abilities: () => ({
      firstTimeDealDamageOpposingHeroEachTurnDraw: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "deal-damage",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
            target: {
              kind: "hero",
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
        limit: {
          count: 1,
          per: "turn",
          ordinals: [1],
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
  },
);

export const { yellow: channelLightningValleyYellow } = channelLightningValley.cards;
