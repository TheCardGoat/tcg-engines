import { legendary, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/golden-gauntlets.generated.ts";

export const goldenGauntlets = defineCard(fabCardIdentitiesByCanonicalId["hBNhqr7gCLz6QMzBDLk8F"], {
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
