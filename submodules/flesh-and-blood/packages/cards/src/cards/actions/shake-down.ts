import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shake-down.generated.ts";

export const shakeDown = definePitchFamily(fabPitchFamilies["shake-down"], {
  keywords: [
    {
      name: "specialization",
      hero: "Uzuri",
    },
  ],
  abilities: () => ({
    vePlayedActivatedAttackReactionChainLinkShakeDownHasWhenHits: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "played-or-activated-this-chain-link-attack-reaction",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroChooseRedYellowBlueTheyRevealTheirHandBanish",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "hit",
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
                    type: "choose-color",
                  },
                  {
                    type: "reveal",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["hand"],
                      count: {
                        type: "all",
                      },
                    },
                  },
                  {
                    type: "banish",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["hand"],
                      filter: {
                        color: ["chosen"],
                      },
                      count: 1,
                    },
                  },
                ],
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const { red: shakeDownRed } = shakeDown.cards;
