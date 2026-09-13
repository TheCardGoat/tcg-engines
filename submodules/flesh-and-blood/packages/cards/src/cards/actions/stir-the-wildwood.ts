import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stir-the-wildwood.generated.ts";

export const stirTheWildwood = definePitchFamily(fabPitchFamilies["stir-the-wildwood"], {
  keywords: [fusion("Earth")],
  abilities: () => ({
    resolutionModifyNumeric: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "deal-arcane-damage",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    continuousStaticModifyNumeric: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const {
  red: stirTheWildwoodRed,
  yellow: stirTheWildwoodYellow,
  blue: stirTheWildwoodBlue,
} = stirTheWildwood.cards;
