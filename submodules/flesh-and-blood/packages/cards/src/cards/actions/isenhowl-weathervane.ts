import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/isenhowl-weathervane.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const isenhowlWeathervane = definePitchFamily(fabPitchFamilies["isenhowl-weathervane"], {
  keywords: [goAgain],
  abilities: (_parameter, { pitch }) => ({
    delayedTriggerFuseThisTurnCreateTokenFrostbite: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "fuse",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "fused-card",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  supertypes: ["Ice"],
                },
              },
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "frostbite",
            creator: "effect-controller",
            controller: "any",
            count: 5 - Number(pitch),
          },
        },
      },
    },
  }),
});

export const {
  red: isenhowlWeathervaneRed,
  yellow: isenhowlWeathervaneYellow,
  blue: isenhowlWeathervaneBlue,
} = isenhowlWeathervane.cards;
