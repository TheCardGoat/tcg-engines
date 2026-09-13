import { legendary, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/golden-gait.generated.ts";

export const goldenGait = defineCard(fabCardIdentitiesByCanonicalId["hWW6zdd6hQ7CwbBt6wc7d"], {
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
