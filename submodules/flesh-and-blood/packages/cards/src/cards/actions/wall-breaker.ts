import { bloodDebt, overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wall-breaker.generated.ts";

export const wallBreaker = definePitchFamily(fabPitchFamilies["wall-breaker"], {
  keywords: [bloodDebt],

  abilities: () => ({
    gainOverpowerAfterBanishingSixPowerCard: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "banish-power-6", player: "controller" },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: overpower,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const {
  red: wallBreakerRed,
  yellow: wallBreakerYellow,
  blue: wallBreakerBlue,
} = wallBreaker.cards;
