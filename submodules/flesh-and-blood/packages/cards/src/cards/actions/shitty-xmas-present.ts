import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shitty-xmas-present.generated.ts";

export const shittyXmasPresent = definePitchFamily(fabPitchFamilies["shitty-xmas-present"], {
  abilities: () => ({
    putCrackedBaubleFromOutsideGameOnTopHeroSDeck: {
      kind: "resolution",
      effect: {
        type: "create-card",
        name: "Cracked Bauble",
        pitch: 2,
        controller: "target-controller",
        target: {
          selector: "any-hero",
        },
        to: {
          zone: "deck",
          position: "top",
        },
      },
    },
  }),
});

export const { yellow: shittyXmasPresentYellow } = shittyXmasPresent.cards;
