import { onHit } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hellbound-assault.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const hellboundAssault = definePitchFamily(fabPitchFamilies["hellbound-assault"], {
  keywords: [bloodDebt],
  abilities: () => ({
    banishOnHit: onHit({ type: "banish", target: { selector: "self" } }),
  }),
});

export const {
  red: hellboundAssaultRed,
  yellow: hellboundAssaultYellow,
  blue: hellboundAssaultBlue,
} = hellboundAssault.cards;
