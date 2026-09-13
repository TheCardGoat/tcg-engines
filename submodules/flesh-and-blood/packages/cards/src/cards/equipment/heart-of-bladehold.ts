import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heart-of-bladehold.generated.ts";

export const heartOfBladehold = defineCard(
  fabCardIdentitiesByCanonicalId["McBPGzHjMtg9mRHRGPMtL"],
  {
    keywords: [battleworn],
    abilities: {
      actionDestroyMayActivateSecondSwordAttackTurnWithout: {
        kind: "activated",
        abilityType: "action",
        cost: { class: "effect", type: "destroy-self" },
        layerKeywords: [goAgain],
        effect: {
          type: "modify-activation-cost",
          op: "subtract",
          amount: 99,
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: {
            next: { typeBox: { subtypes: ["Sword"] } },
            events: ["activate"],
            ordinal: 2,
          },
        },
      },
    },
  },
);
