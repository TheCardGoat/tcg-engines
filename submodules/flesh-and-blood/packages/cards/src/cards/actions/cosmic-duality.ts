import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cosmic-duality.generated.ts";
import { fragment } from "../shared/keywords.ts";
const abilities = {
  dealDamageCreateTokenLightningFlowActivation: {
    kind: "activated",
    abilityType: "instant",
    cost: {
      class: "mixed",
      type: "all",
      costs: [
        {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        {
          class: "effect",
          type: "discard-self",
        },
      ],
    },
    effect: {
      type: "sequence",
      steps: [
        {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "any-hero",
          },
        },
        {
          type: "create-token",
          token: "lightning-flow",
          controller: "controller",
        },
      ],
    },
  },
} as const;
export const cosmicDuality = definePitchFamily(fabPitchFamilies["cosmic-duality"], {
  keywords: [fragment],
  abilities: () => ({ ...abilities }),
});
export const {
  red: cosmicDualityRed,
  yellow: cosmicDualityYellow,
  blue: cosmicDualityBlue,
} = cosmicDuality.cards;
