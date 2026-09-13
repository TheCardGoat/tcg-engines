import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/red-lure-harpoon.generated.ts";

export const redLureHarpoon = definePitchFamily(fabPitchFamilies["red-lure-harpoon"], {
  abilities: () => ({
    activatedCannonTurnGetsHitsBanishRedActionGraveyardPlayEndNextTurn: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "performed-this-turn",
        event: "activate-cannon",
        player: "controller",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "hitsBanishRedActionGraveyardPlayEndNextTurn",
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
                    type: "banish",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["graveyard"],
                      filter: {
                        color: ["red"],
                        typeBox: {
                          types: ["Action"],
                        },
                      },
                      count: 1,
                    },
                    outputBinding: "it",
                  },
                  {
                    type: "optional",
                    effect: {
                      type: "play-card",
                      fromZones: ["banished"],
                      source: {
                        selector: "binding",
                        binding: "it",
                      },
                      duration: "until-end-of-own-next-turn",
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

export const { blue: redLureHarpoonBlue } = redLureHarpoon.cards;
