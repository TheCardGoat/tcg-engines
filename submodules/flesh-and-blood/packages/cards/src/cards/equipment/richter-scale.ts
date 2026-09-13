import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/richter-scale.generated.ts";

/**
 * MPG006 Richter Scale — Guardian Chest d1 Battleworn.
 *
 * Printed:
 *   Action - Destroy this: Create 2 Seismic Surge tokens.
 *   Battleworn
 *
 * Model notes (hand-authored):
 * - Action destroy-self (no resource cost, spends 1 AP; no printed go again).
 * - create-token seismic-surge count 2 under controller.
 * - Battleworn independent lifecycle on defend.
 */
export const richterScale = defineCard(fabCardIdentitiesByCanonicalId["dp6nprbWWLQwqMdcwW6Wz"], {
  keywords: [battleworn],
  abilities: {
    actionDestroyCreate2SeismicSurgeTokens: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "create-token",
        token: "seismic-surge",
        controller: "controller",
        count: 2,
      },
    },
  },
});
