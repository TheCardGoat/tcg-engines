import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spinning-wheel-kick.generated.ts";
import { comboStatic } from "@tcg/flesh-and-blood-types";
import { combo, goAgain } from "../shared/keywords.ts";

export const spinningWheelKick = definePitchFamily(fabPitchFamilies["spinning-wheel-kick"], {
  keywords: [goAgain, combo],
  abilities: () => ({
    comboStatic: comboStatic({
      names: ["Twin Twisters", "Spinning Wheel Kick"],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "triggeredStaticOnHitEffect",
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
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "move-card",
                    target: {
                      selector: "self",
                    },
                    to: {
                      zone: "deck",
                      position: "bottom",
                    },
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    }),
  }),
});

export const {
  red: spinningWheelKickRed,
  yellow: spinningWheelKickYellow,
  blue: spinningWheelKickBlue,
} = spinningWheelKick.cards;
