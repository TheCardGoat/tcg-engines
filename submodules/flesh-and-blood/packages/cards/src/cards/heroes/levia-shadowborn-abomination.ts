import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/levia-shadowborn-abomination.generated.ts";

export const leviaShadowbornAbomination = defineCard(
  fabCardIdentitiesByCanonicalId["KCwnGqDJtnmJfth7fn8Qq"],
  {
    abilities: {
      preventBloodDebtLifeLossAfterBanishingSixPower: {
        kind: "static",
        staticKind: "continuous",
        condition: { type: "performed-this-turn", event: "banish-power-6", player: "controller" },
        effect: {
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
  },
);
