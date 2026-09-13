import { overpower, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/nitro-mechanoid.generated.ts";

export const nitroMechanoid = defineCard(fabCardIdentitiesByCanonicalId["wCLt8CtdLmrbMPcqLCzqc"], {
  keywords: [overpower, temper],
  abilities: {
    actionBanishFromUnderNitroMechanoidAttack: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "effect",
        type: "banish",
        from: "under-this",
        count: 1,
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
