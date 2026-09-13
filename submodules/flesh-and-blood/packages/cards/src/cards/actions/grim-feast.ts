import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/grim-feast.generated.ts";
export const grimFeast = definePitchFamily(fabPitchFamilies["grim-feast"], {
  parameters: pitchMap({ red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } }),
  keywords: [bloodDebt],
  abilities: ({ value1 }) => ({
    staticPlayModifyNumericCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
        optional: true,
        then: {
          type: "modify-numeric",
          property: "cost",
          op: "subtract",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "while-condition",
        },
      },
    },
    resolutionGainLife: {
      kind: "resolution",
      effect: {
        type: "gain-life",
        amount: value1,
        target: {
          selector: "controller",
        },
      },
    },
  }),
});
export const { red: grimFeastRed, yellow: grimFeastYellow, blue: grimFeastBlue } = grimFeast.cards;
