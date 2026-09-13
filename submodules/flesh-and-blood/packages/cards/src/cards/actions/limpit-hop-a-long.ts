import { goAgain, wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/limpit-hop-a-long.generated.ts";

export const limpitHopALong = definePitchFamily(fabPitchFamilies["limpit-hop-a-long"], {
  keywords: [wateryGrave],
  abilities: () => ({
    actionResourceTapAttackGoAgain: {
      kind: "activated",
      abilityType: "attack",
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
            type: "tap-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
  }),
});

export const { yellow: limpitHopALongYellow } = limpitHopALong.cards;
