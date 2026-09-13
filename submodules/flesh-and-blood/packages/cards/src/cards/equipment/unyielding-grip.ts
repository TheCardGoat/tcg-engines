import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/unyielding-grip.generated.ts";

export const unyieldingGrip = defineCard(fabCardIdentitiesByCanonicalId["WmjGRT9w9pHtBDc8zQkHB"], {
  keywords: [bladeBreak],
  abilities: {
    ifHaveNoHandGets3: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "zone-count",
        zone: "hand",
        player: "controller",
        comparison: {
          op: "eq",
          value: 0,
        },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  },
});
