import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/twinning-blade.generated.ts";

export const twinningBlade = definePitchFamily(fabPitchFamilies["twinning-blade"], {
  abilities: () => ({
    grantAdditionalSwordAttack: {
      kind: "resolution",
      effect: {
        type: "modify-activation-limit",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["weapon"],
          filter: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
          count: 1,
        },
        operation: "additional",
        count: 1,
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: twinningBladeYellow } = twinningBlade.cards;
