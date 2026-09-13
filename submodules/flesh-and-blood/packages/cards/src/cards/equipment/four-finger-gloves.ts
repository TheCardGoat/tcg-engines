import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/four-finger-gloves.generated.ts";

export const fourFingerGloves = defineCard(
  fabCardIdentitiesByCanonicalId["hqnLfCpjbMKBrjTHQNRfk"],
  {
    abilities: {
      instantDestroyPreventNext1DamageWouldBeDealt: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        condition: { type: "performed-this-turn", event: "be-dealt-damage", player: "controller" },
        effect: {
          type: "prevention",
          preventionKind: "fixed",
          amount: 1,
          shielded: {
            selector: "controller",
          },
          duration: "this-turn",
        },
      },
    },
  },
);
