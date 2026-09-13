import { arcaneBarrier } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rusted-relic.generated.ts";

export const rustedRelic = definePitchFamily(fabPitchFamilies["rusted-relic"], {
  keywords: [arcaneBarrier(1)],
});

export const { blue: rustedRelicBlue } = rustedRelic.cards;
