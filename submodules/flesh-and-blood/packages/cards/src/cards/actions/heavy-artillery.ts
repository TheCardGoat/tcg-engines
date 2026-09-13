import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heavy-artillery.generated.ts";

export const heavyArtillery = definePitchFamily(fabPitchFamilies["heavy-artillery"], {
  abilities: () => ({
    ruleModificationRestrictDefendCountThisCombatChainEvoUpgrade: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "defend",
        filter: attackActionFilter({
          cost: {
            op: "lt",
            value: {
              type: "count",
              what: "evos-equipped",
            },
          },
        }),
        duration: "this-combat-chain",
      },
      label: {
        name: "evo-upgrade",
      },
    },
  }),
});

export const {
  red: heavyArtilleryRed,
  yellow: heavyArtilleryYellow,
  blue: heavyArtilleryBlue,
} = heavyArtillery.cards;
