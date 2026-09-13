import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tearing-shuko.generated.ts";

export const tearingShuko = defineCard(fabCardIdentitiesByCanonicalId["hwnbrjRKLGTmzF8wf6QDH"], {
  keywords: [battleworn],
  abilities: {
    instantDestroyNextCrouchingTigerPlayTurnGains2: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        // Printed "next Crouching Tiger" is a card name, not split subtypes.
        // Crouching Tiger's type box is Ninja Action Attack (no Crouching/Tiger).
        appliesTo: {
          next: {
            name: "Crouching Tiger",
          },
        },
      },
    },
  },
});
