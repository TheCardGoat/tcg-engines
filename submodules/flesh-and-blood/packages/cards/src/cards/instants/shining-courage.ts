import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/shining-courage.generated.ts";

export const shiningCourage = definePitchFamily(fabPitchFamilies["shining-courage"], {
  abilities: () => ({
    upOneTargetDefendingActionGets3Turn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 3,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
            defending: true,
          },
          count: { type: "up-to", amount: 1 },
        },
        duration: "this-turn",
        outputBinding: "it",
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
    crowdCheers: {
      kind: "resolution",
      effect: {
        type: "crowd-cheers",
        target: "controller",
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
  }),
});

export const { red: shiningCourageRed } = shiningCourage.cards;
