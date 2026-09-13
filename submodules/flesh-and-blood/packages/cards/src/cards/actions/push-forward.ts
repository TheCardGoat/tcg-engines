import { dominate, goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/push-forward.generated.ts";

export const pushForward = definePitchFamily(fabPitchFamilies["push-forward"], {
  parameters: { red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } },
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    modifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Weapon"],
            },
          },
        },
      },
    },
    performedThisTurnAttackWithWeaponGrantPropertyThisTurn: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "attack-with-weapon",
        player: "controller",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: dominate,
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});

export const {
  red: pushForwardRed,
  yellow: pushForwardYellow,
  blue: pushForwardBlue,
} = pushForward.cards;
