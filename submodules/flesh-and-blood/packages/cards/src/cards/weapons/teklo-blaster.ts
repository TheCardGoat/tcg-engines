import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/teklo-blaster.generated.ts";

export const tekloBlaster = defineCard(fabCardIdentitiesByCanonicalId["fwNFw9pTWMpgz8t9dCgMD"], {
  abilities: {
    oncePerTurnActionResourceResourceResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 3,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
  },
});
