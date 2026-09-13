import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rifting.generated.ts";

export const rifting = definePitchFamily(fabPitchFamilies["rifting"], {
  abilities: () => ({
    triggeredHitOptionalPlayCardThisTurn: {
      kind: "static",
      staticKind: "triggered",
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "play-card",
            fromZones: ["hand", "arsenal"],
            source: {
              selector: "self",
            },
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
            },
            duration: "this-turn",
            asType: "instant",
          },
        },
      },
    },
  }),
});

export const { red: riftingRed, yellow: riftingYellow, blue: riftingBlue } = rifting.cards;
