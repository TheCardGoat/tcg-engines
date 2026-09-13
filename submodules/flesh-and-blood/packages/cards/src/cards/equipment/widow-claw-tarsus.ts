import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/widow-claw-tarsus.generated.ts";
import { arcaneBarrier, spellvoid } from "../shared/keywords.ts";

export const widowClawTarsus = defineCard(fabCardIdentitiesByCanonicalId["zCDtKnHDDB7DNN9GQkGRz"], {
  keywords: [arcaneBarrier(1), spellvoid(1)],
});
