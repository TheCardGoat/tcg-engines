import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/orb-weaver-spinneret.generated.ts";

export const orbWeaverSpinneret = definePitchFamily(fabPitchFamilies["orb-weaver-spinneret"], {
  keywords: [goAgain],
  abilities: () => ({
    equipAGrapheneCheliceraToken: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "graphene-chelicera",
            controller: "controller",
            outputBinding: "created-chelicera",
          },
          {
            type: "equip",
            target: {
              selector: "binding",
              binding: "created-chelicera",
            },
          },
        ],
      },
    },
    modifyNumericPowerThisTurn: {
      kind: "resolution",

      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasKeyword: "stealth",
          },
        },
      },
    },
  }),
});

export const {
  red: orbWeaverSpinneretRed,
  yellow: orbWeaverSpinneretYellow,
  blue: orbWeaverSpinneretBlue,
} = orbWeaverSpinneret.cards;
