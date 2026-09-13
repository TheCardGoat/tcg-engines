import { createToken, onHit } from "@tcg/flesh-and-blood-types";
import { bloodDebt, usurp } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowake-gloomblade.generated.ts";

export const shadowakeGloomblade = definePitchFamily(fabPitchFamilies["shadowake-gloomblade"], {
  keywords: [usurp, bloodDebt],
  abilities: () => ({
    banishedPermission: {
      kind: "static",
      staticKind: "play",
      playEffect: { role: "permission", fromZones: ["banished"] },
    },
    onHitCreateGate: onHit(createToken("gate-to-i-arathael")),
  }),
});

export const {
  red: shadowakeGloombladeRed,
  yellow: shadowakeGloombladeYellow,
  blue: shadowakeGloombladeBlue,
} = shadowakeGloomblade.cards;
