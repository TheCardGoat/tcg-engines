import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { bloodDebt, goAgain, usurp } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bloodfrenzy-gloomblade.generated.ts";

export const bloodfrenzyGloomblade = definePitchFamily(fabPitchFamilies["bloodfrenzy-gloomblade"], {
  keywords: [usurp, bloodDebt],
  abilities: () => ({
    banishedPermission: {
      kind: "static",
      staticKind: "play",
      playEffect: { role: "permission", fromZones: ["banished"] },
    },
    goAgainAfterDealingDamage: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "deal-damage", player: "controller" },
      effect: grantKeyword(goAgain, { target: { selector: "self" } }),
    },
  }),
});

export const {
  red: bloodfrenzyGloombladeRed,
  yellow: bloodfrenzyGloombladeYellow,
  blue: bloodfrenzyGloombladeBlue,
} = bloodfrenzyGloomblade.cards;
