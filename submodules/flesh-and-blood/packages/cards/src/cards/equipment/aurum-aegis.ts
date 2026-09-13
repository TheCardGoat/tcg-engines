import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/aurum-aegis.generated.ts";

export const aurumAegis = defineCard(fabCardIdentitiesByCanonicalId["qMpdhqQqktTKQHcQJ8f6B"], {
  keywords: [
    {
      name: "specialization",
      hero: "Victor",
    },
    temper,
  ],
  abilities: {
    countsAsGold: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "name",
          value: "Gold",
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  },
});
