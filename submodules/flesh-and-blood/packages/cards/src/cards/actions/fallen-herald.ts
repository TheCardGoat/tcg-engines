import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fallen-herald.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const fallenHerald = definePitchFamily(fabPitchFamilies["fallen-herald"], {
  keywords: [bloodDebt],
  abilities: () => ({
    instant: {
      kind: "activated",
      functionalZones: ["hand"],
      abilityType: "instant",
      cost: { class: "effect", type: "banish-self" },
      effect: {
        type: "prevention",
        preventionKind: "shielding",
        amount: 4,
        shielded: { selector: "controller" },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: fallenHeraldYellow } = fallenHerald.cards;
