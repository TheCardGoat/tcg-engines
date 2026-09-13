import { goAgain, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/myrkhellir-helm.generated.ts";

export const myrkhellirHelm = defineCard(fabCardIdentitiesByCanonicalId["zJ9h7zCdQcttTrmgLR6q9"], {
  keywords: [temper],
  abilities: {
    ifControlGoldGets1: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "control-object",
        // Gold is an Item/Token named "Gold" — not a supertype "Gold".
        filter: {
          name: "Gold",
          typeBox: {
            metatypes: ["Token"],
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        // Continuous while-condition (CR 5.4.7 / lignum-vitae / dynastic-diadem):
        // re-eval while equipped — not a this-turn grant that drops at EOT.
        duration: "permanent",
      },
    },
    actionDestroyNextTimeWouldDrawFromGoldToken: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "replacement",
        replacementKind: "standard",
        // `filter` qualifies the *source* of the draw (Gold token ability),
        // not the drawn card — engine matches event.source for draw replacements.
        replaces: {
          name: "draw",
          filter: {
            name: "Gold",
            typeBox: {
              metatypes: ["Token"],
            },
          },
        },
        // Draw events are one-card-per-event; +1 count = one extra draw sub-event.
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
  },
});
