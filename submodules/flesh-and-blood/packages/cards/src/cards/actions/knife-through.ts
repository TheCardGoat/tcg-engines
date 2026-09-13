import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/knife-through.generated.ts";
import { stealth } from "../shared/keywords.ts";

const abilities = {
  compareAmountCountGrantPropertyGoAgainThisTurn: {
    kind: "resolution",
    condition: {
      type: "compare-amount",
      amount: {
        type: "count",
        what: "attacks-hit-this-combat-chain",
        filter: {
          typeBox: {
            subtypes: ["Dagger"],
          },
        },
      },
      comparison: {
        op: "gte",
        value: 1,
      },
    },
    effect: {
      type: "grant-property",
      property: {
        kind: "keyword",
        keyword: {
          name: "go-again",
        },
      },
      target: {
        selector: "self",
      },
      duration: "this-turn",
    },
  },
} as const;

export const knifeThrough = definePitchFamily(fabPitchFamilies["knife-through"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const {
  red: knifeThroughRed,
  yellow: knifeThroughYellow,
  blue: knifeThroughBlue,
} = knifeThrough.cards;
