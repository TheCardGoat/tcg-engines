import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/put-on-ice.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const putOnIce = definePitchFamily(fabPitchFamilies["put-on-ice"], {
  keywords: [goAgain],
  abilities: (_parameter, { pitch }) => ({
    freezeUpToUntilStartOfOwnNextTurnFreeze: {
      kind: "resolution",
      effect: {
        type: "freeze",
        target: {
          selector: "object",
          declared: "on-stack",
          // “target allies” has no controller restriction: either player's
          // Ally is a legal target (the controller default only found ours).
          player: "any",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Ally"],
            },
          },
          count: { type: "up-to", amount: 4 - Number(pitch) },
        },
        duration: "until-start-of-own-next-turn",
      },
      label: {
        name: "freeze",
      },
    },
    playedThisDrawFreeze: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["arsenal"] },
      },
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
      label: {
        name: "freeze",
      },
    },
  }),
});

export const { red: putOnIceRed, yellow: putOnIceYellow, blue: putOnIceBlue } = putOnIce.cards;
