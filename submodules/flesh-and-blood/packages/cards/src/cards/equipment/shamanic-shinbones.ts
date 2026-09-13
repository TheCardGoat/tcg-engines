import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/shamanic-shinbones.generated.ts";
import { arcaneBarrier } from "../shared/keywords.ts";

export const shamanicShinbones = defineCard(
  fabCardIdentitiesByCanonicalId["bMdwPwTh7FJBpzbqTctKB"],
  {
    keywords: [arcaneBarrier(1)],
  },
);
