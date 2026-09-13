import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pulsewave-protocol.generated.ts";

export const pulsewaveProtocol = definePitchFamily(fabPitchFamilies["pulsewave-protocol"], {
  abilities: () => ({
    attacksRevealXHandWhereXNumberEvosEquippedChooseActionDefenseLessThanXThenAddChainLinkDefending:
      {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "attack",
            },
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["hand"],
                  count: {
                    type: "count",
                    what: "evos-equipped",
                  },
                },
                outputBinding: "it",
              },
              {
                type: "choose-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["hand"],
                  filter: {
                    typeBox: {
                      types: ["Action"],
                    },
                    defense: {
                      op: "lt",
                      value: {
                        type: "count",
                        what: "evos-equipped",
                      },
                    },
                  },
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "add-defending",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
            ],
          },
        },
        label: {
          name: "evo-upgrade",
        },
      },
  }),
});

export const { yellow: pulsewaveProtocolYellow } = pulsewaveProtocol.cards;
