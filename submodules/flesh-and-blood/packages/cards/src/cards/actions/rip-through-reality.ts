import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rip-through-reality.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const ripThroughReality = definePitchFamily(fabPitchFamilies["rip-through-reality"], {
  keywords: [bloodDebt],
  abilities: () => ({
    play: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    performedThisTurnDealArcaneDamageGrantPropertyThisTurn: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "deal-arcane-damage",
        player: "controller",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
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
  red: ripThroughRealityRed,
  yellow: ripThroughRealityYellow,
  blue: ripThroughRealityBlue,
} = ripThroughReality.cards;
