import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shrill-of-skullform.generated.ts";

export const shrillOfSkullform = definePitchFamily(fabPitchFamilies["shrill-of-skullform"], {
  abilities: () => ({
    resolutionModifyNumeric: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-or-create-aura",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: shrillOfSkullformRed,
  yellow: shrillOfSkullformYellow,
  blue: shrillOfSkullformBlue,
} = shrillOfSkullform.cards;
