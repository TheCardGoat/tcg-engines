import { bloodDebt, usurp } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/demonbound-gloomblade.generated.ts";

export const demonboundGloomblade = definePitchFamily(fabPitchFamilies["demonbound-gloomblade"], {
  keywords: [usurp, bloodDebt],
  abilities: () => ({
    mayPlayFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
  }),
});
export const {
  red: demonboundGloombladeRed,
  yellow: demonboundGloombladeYellow,
  blue: demonboundGloombladeBlue,
} = demonboundGloomblade.cards;
