import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, modalAbility, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/short-and-sharp.generated.ts";

export const shortAndSharp = definePitchFamily(fabPitchFamilies["short-and-sharp"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    chooseMode: modalAbility({
      kind: "modal",
      modal: { choose: 1 },
      modes: {
        daggerAttack: {
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
        lowPowerAttack: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: attackActionFilter({
              numeric: [{ property: "power", basis: "base", comparison: { op: "lte", value: 2 } }],
            }),
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
    }),
  }),
});
export const {
  red: shortAndSharpRed,
  yellow: shortAndSharpYellow,
  blue: shortAndSharpBlue,
} = shortAndSharp.cards;
