import { goAgain, piercing } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/humour-plunge.generated.ts";

export const humourPlunge = defineCard(fabCardIdentitiesByCanonicalId["rN8CLmcfzpNLwbgJJCzwK"], {
  keywords: [piercing(1)],
  abilities: {
    actionResourceResourceTapAttackGoAgain: {
      kind: "activated",
      abilityType: "attack",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 2 },
          { class: "effect", type: "tap-self" },
        ],
      },
      layerKeywords: [goAgain],
      effect: { type: "attack-with", target: { selector: "self" } },
    },
    attackingInfectedGets1Power: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "control-object",
        player: "attack-target",
        filter: { typeBox: { subtypes: ["Disease"] } },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: { selector: "attack-from-source" },
        duration: "while-condition",
      },
    },
  },
});
