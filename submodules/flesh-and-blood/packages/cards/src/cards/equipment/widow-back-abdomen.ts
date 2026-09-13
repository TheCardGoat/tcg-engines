import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/widow-back-abdomen.generated.ts";
import { arcaneBarrier, spellvoid } from "../shared/keywords.ts";

export const widowBackAbdomen = defineCard(
  fabCardIdentitiesByCanonicalId["WwzgnmM8QrrwPpb8m7Mt9"],
  {
    keywords: [arcaneBarrier(1), spellvoid(1)],
  },
);
