import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/envelop-in-darkness.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const envelopInDarkness = definePitchFamily(fabPitchFamilies["envelop-in-darkness"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolutionCreateTokenRunechant: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "runechant",
        controller: "controller",
      },
    },
    resolutionModifyNumericPower: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({ hasStatus: "rune-gated" }),
      },
    },
  }),
});
export const {
  red: envelopInDarknessRed,
  yellow: envelopInDarknessYellow,
  blue: envelopInDarknessBlue,
} = envelopInDarkness.cards;
