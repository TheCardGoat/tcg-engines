import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/steel-on-steel.generated.ts";

export const steelOnSteel = definePitchFamily(fabPitchFamilies["steel-on-steel"], {
  abilities: () => ({
    gainDefenseAgainstWeaponAttack: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defending-a-weapon-attack",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: steelOnSteelRed,
  yellow: steelOnSteelYellow,
  blue: steelOnSteelBlue,
} = steelOnSteel.cards;
