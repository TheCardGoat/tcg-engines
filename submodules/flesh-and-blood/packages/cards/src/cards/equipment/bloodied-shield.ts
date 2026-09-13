import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bloodied-shield.generated.ts";

export const bloodiedShield = defineCard(fabCardIdentitiesByCanonicalId["7p6zQ9qPTLtrWq8Wg6zjC"], {
  keywords: [bladeBreak],
  abilities: {
    mayEquip: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "optional",
        effect: {
          type: "equip",
          target: {
            selector: "self",
          },
        },
      },
    },
  },
});
