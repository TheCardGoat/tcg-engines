import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/roar-of-the-tiger.generated.ts";

export const roarOfTheTiger = definePitchFamily(fabPitchFamilies["roar-of-the-tiger"], {
  keywords: [goAgain],
  abilities: () => ({
    createCrouchingTigerHand: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "crouching-tiger",
        controller: "controller",
        to: {
          zone: "hand",
        },
      },
    },
    crouchingTigersGain1PowerTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            moniker: "Crouching Tiger",
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: roarOfTheTigerYellow } = roarOfTheTiger.cards;
