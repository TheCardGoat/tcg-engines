import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/dealer-s-grip.generated.ts";

export const dealerSGrip = defineCard(fabCardIdentitiesByCanonicalId["P6KMTbdFTMKLgpDzg6Ltp"], {
  keywords: [battleworn],
  abilities: {
    attackReactionDestroyTargetAttackHasWageredGets1: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 2 },
          { class: "effect", type: "destroy-self" },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: { typeBox: { subtypes: ["Attack"] }, hasStatus: "wagered" },
          count: 1,
        },
        duration: "this-turn",
      },
    },
  },
});
