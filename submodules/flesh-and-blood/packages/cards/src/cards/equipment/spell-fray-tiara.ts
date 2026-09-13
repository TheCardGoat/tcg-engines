import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/spell-fray-tiara.generated.ts";
import { spellvoid } from "../shared/keywords.ts";

export const spellFrayTiara = defineCard(fabCardIdentitiesByCanonicalId["997QbbqzqGhMQP6HqFghP"], {
  keywords: [spellvoid(1)],
});
