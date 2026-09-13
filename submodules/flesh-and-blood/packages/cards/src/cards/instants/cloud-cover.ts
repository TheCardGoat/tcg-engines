import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/cloud-cover.generated.ts";

export const cloudCover = definePitchFamily(fabPitchFamilies["cloud-cover"], {
  parameters: pitchMap({
    red: 3,
    yellow: 2,
    blue: 1,
  }),
  abilities: (amount) => ({
    preventDamage: {
      type: "prevention",
      preventionKind: "fixed",
      amount,
      shielded: { selector: "controller" },
      duration: "this-turn",
    },
  }),
});

export const {
  red: cloudCoverRed,
  yellow: cloudCoverYellow,
  blue: cloudCoverBlue,
} = cloudCover.cards;
