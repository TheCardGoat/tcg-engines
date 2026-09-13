import { ambush } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/tiger-eye-reflex.generated.ts";

export const tigerEyeReflex = definePitchFamily(fabPitchFamilies["tiger-eye-reflex"], {
  keywords: [ambush],
  abilities: () => ({
    createCrouchingTigerOnDefend: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "create-token",
              token: "crouching-tiger",
              controller: "controller",
              to: {
                zone: "banished",
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
  }),
});

export const { yellow: tigerEyeReflexYellow, blue: tigerEyeReflexBlue } = tigerEyeReflex.cards;
