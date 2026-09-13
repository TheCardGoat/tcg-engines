import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/meganetic-shockwave.generated.ts";

export const meganeticShockwave = definePitchFamily(fabPitchFamilies["meganetic-shockwave"], {
  abilities: () => ({
    defendingMustDefendMeganeticShockwaveXEquipmentWhereXNumberTimesBoostedCombatChain: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "require",
        action: "defend",
        filter: {
          typeBox: {
            types: ["Equipment"],
          },
        },
        limit: {
          count: {
            type: "count",
            what: "boosts-this-combat-chain",
          },
        },
        duration: "this-combat-chain",
      },
    },
  }),
});

export const { blue: meganeticShockwaveBlue } = meganeticShockwave.cards;
