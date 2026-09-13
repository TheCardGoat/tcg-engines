import { legendary, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/golden-galea.generated.ts";

export const goldenGalea = defineCard(fabCardIdentitiesByCanonicalId["RWHJMQ9jdRHFHKNqcJDMD"], {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Olympia",
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
