import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/levia.generated.ts";

export const levia = defineCard(fabCardIdentitiesByCanonicalId["WwzJLfPwhRTkFLDNjJPrk"], {
  abilities: {
    preventBloodDebtLifeLossAfterBanishingSixPower: {
      kind: "static",
      staticKind: "continuous",
      // History flag set when a power-6+ card is banished (not "currently in banished").
      condition: { type: "performed-this-turn", event: "banish-power-6", player: "controller" },
      effect: {
        // Checked by blood-debt end-phase (handleBloodDebt) via rules("lose-life").
        type: "rule-modification",
        mode: "restrict",
        action: "lose-life",
        filter: {
          hasKeyword: "blood-debt",
        },
        duration: "while-in-arena",
      },
    },
  },
});
