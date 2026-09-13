import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/to-the-point.generated.ts";

export const toThePoint = definePitchFamily(fabPitchFamilies["to-the-point"], {
  supertypeSets: [["Assassin"], ["Warrior"]],
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    markedDagger: {
      type: "conditional",
      condition: { type: "is-marked", target: { selector: "defending-hero" } },
      then: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: amount + 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: { typeBox: { subtypes: ["Dagger"] } },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
      else: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: { typeBox: { subtypes: ["Dagger"] } },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});
export const {
  red: toThePointRed,
  yellow: toThePointYellow,
  blue: toThePointBlue,
} = toThePoint.cards;
