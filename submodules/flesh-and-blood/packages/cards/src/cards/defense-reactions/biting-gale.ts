import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/biting-gale.generated.ts";

export const bitingGale = definePitchFamily(fabPitchFamilies["biting-gale"], {
  keywords: [fusion("Ice")],

  abilities: () => ({
    fusedDiscardUnlessPay: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "unless",
        effect: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attacking-hero",
            zones: ["hand"],
            count: 1,
          },
        },
        escape: {
          type: "pay",
          cost: {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          payer: "attacking-hero",
        },
      },
    },
  }),
});
export const {
  red: bitingGaleRed,
  yellow: bitingGaleYellow,
  blue: bitingGaleBlue,
} = bitingGale.cards;
