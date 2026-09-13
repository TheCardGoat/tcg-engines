import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/little-big-foot.generated.ts";

const POWER_BONUS_BY_PITCH = { 1: 6, 2: 5, 3: 4, 4: 4 } as const;

export const littleBigFoot = definePitchFamily(fabPitchFamilies["little-big-foot"], {
  abilities: (_parameter, { pitch }) => ({
    zoneCountModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "pitch",
        player: "controller",
        filter: {
          cost: {
            op: "gte",
            value: 3,
          },
        },
        comparison: {
          op: "gte",
          value: 2,
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: POWER_BONUS_BY_PITCH[pitch],
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const {
  red: littleBigFootRed,
  yellow: littleBigFootYellow,
  blue: littleBigFootBlue,
} = littleBigFoot.cards;
